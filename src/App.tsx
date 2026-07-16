import { useEffect, useState } from 'react';
import './App.css';
import { LANG_KEY, type Lang, loadLang, MESSAGES } from './i18n';
import { formatUnitPrice, UNITS, type Unit, unitPrice } from './unitPrice';

type Item = {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit: Unit;
};

const STORAGE_KEY = 'items';

const load = (): Item[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

const App = () => {
  const [items, setItems] = useState<Item[]>(load);
  const [lang, setLang] = useState<Lang>(loadLang);
  const t = MESSAGES[lang];
  const thb = new Intl.NumberFormat(t.locale, {
    style: 'currency',
    currency: 'THB',
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const addItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // ponytail: ชื่อซ้ำได้หลังลบรายการ — ไม่เป็นไร ใช้ id เป็น key อยู่แล้ว
    const autoName = t.autoName(items.length + 1);
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        name: String(data.get('name')).trim() || autoName,
        price: Number(data.get('price')),
        qty: Number(data.get('qty')),
        unit: data.get('unit') as Unit,
      },
    ]);
    form.reset();
  };

  const groups = (['mass', 'volume', 'count'] as const)
    .map((dim) => ({
      dim,
      items: items
        .filter((it) => UNITS[it.unit].dim === dim)
        .sort(
          (a, b) =>
            unitPrice(a.price, a.qty, a.unit) -
            unitPrice(b.price, b.qty, b.unit),
        ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="app">
      <div className="header">
        <h1>{t.title}</h1>
        <button
          type="button"
          className="lang-toggle"
          onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
        >
          {lang === 'th' ? 'EN' : 'ไทย'}
        </button>
      </div>
      <p className="subtitle">{t.subtitle}</p>

      <form className="add-form" onSubmit={addItem}>
        <input name="name" placeholder={t.namePlaceholder} />
        <input
          name="price"
          type="number"
          placeholder={t.pricePlaceholder}
          required
          min="0.01"
          step="any"
        />
        <input
          name="qty"
          type="number"
          placeholder={t.qtyPlaceholder}
          required
          min="0.001"
          step="any"
        />
        <select name="unit" defaultValue="g">
          {Object.keys(UNITS).map((key) => (
            <option key={key} value={key}>
              {t.units[key as Unit]}
            </option>
          ))}
        </select>
        <button type="submit">{t.add}</button>
      </form>

      {items.length === 0 && <p className="empty">{t.empty}</p>}

      {groups.map((group) => {
        const best = unitPrice(
          group.items[0].price,
          group.items[0].qty,
          group.items[0].unit,
        );
        return (
          <section key={group.dim}>
            <h2>{t.dims[group.dim]}</h2>
            <ul className="item-list">
              {group.items.map((it, i) => {
                const per = unitPrice(it.price, it.qty, it.unit);
                const pctMore = ((per - best) / best) * 100;
                return (
                  <li key={it.id} className={i === 0 ? 'item best' : 'item'}>
                    <div className="item-main">
                      <span className="item-name">
                        {it.name}
                        {i === 0 && group.items.length > 1 && (
                          <span className="badge">{t.best}</span>
                        )}
                      </span>
                      <span className="item-detail">
                        {thb.format(it.price)} / {it.qty} {t.units[it.unit]}
                      </span>
                    </div>
                    <div className="item-price">
                      <span className="per-unit">
                        {formatUnitPrice(per, group.dim, lang)}
                      </span>
                      {i > 0 && (
                        <span className="pct-more">
                          {t.moreExpensive(pctMore.toFixed(0))}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="delete"
                      aria-label={t.deleteItem(it.name)}
                      onClick={() =>
                        setItems(items.filter((x) => x.id !== it.id))
                      }
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {items.length > 0 && (
        <button
          type="button"
          className="clear-all"
          onClick={() => setItems([])}
        >
          {t.clearAll}
        </button>
      )}
    </div>
  );
};

export default App;
