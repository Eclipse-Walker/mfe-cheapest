import { useEffect, useState } from 'react';
import './App.css';
import {
  type Dimension,
  formatUnitPrice,
  UNITS,
  type Unit,
  unitPrice,
} from './unitPrice';

type Item = {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit: Unit;
};

const STORAGE_KEY = 'items';
const DIM_LABEL: Record<Dimension, string> = {
  mass: 'ตามน้ำหนัก',
  volume: 'ตามปริมาตร',
  count: 'ตามจำนวนชิ้น',
};
const thb = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
});

const load = (): Item[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

const App = () => {
  const [items, setItems] = useState<Item[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        name: String(data.get('name')),
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
      <h1>🛒 อันไหนถูกสุด?</h1>
      <p className="subtitle">กรอกราคาและปริมาณ แล้วดูว่าชิ้นไหนคุ้มค่าที่สุด</p>

      <form className="add-form" onSubmit={addItem}>
        <input name="name" placeholder="ชื่อสินค้า" required />
        <input
          name="price"
          type="number"
          placeholder="ราคา (บาท)"
          required
          min="0.01"
          step="any"
        />
        <input
          name="qty"
          type="number"
          placeholder="ปริมาณ"
          required
          min="0.001"
          step="any"
        />
        <select name="unit" defaultValue="g">
          {Object.entries(UNITS).map(([key, u]) => (
            <option key={key} value={key}>
              {u.label}
            </option>
          ))}
        </select>
        <button type="submit">เพิ่ม</button>
      </form>

      {items.length === 0 && (
        <p className="empty">ยังไม่มีสินค้า — ลองเพิ่มสัก 2 ชิ้นเพื่อเปรียบเทียบ</p>
      )}

      {groups.map((group) => {
        const best = unitPrice(
          group.items[0].price,
          group.items[0].qty,
          group.items[0].unit,
        );
        return (
          <section key={group.dim}>
            <h2>{DIM_LABEL[group.dim]}</h2>
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
                          <span className="badge">🏆 คุ้มสุด</span>
                        )}
                      </span>
                      <span className="item-detail">
                        {thb.format(it.price)} / {it.qty} {UNITS[it.unit].label}
                      </span>
                    </div>
                    <div className="item-price">
                      <span className="per-unit">
                        {formatUnitPrice(per, group.dim)}
                      </span>
                      {i > 0 && (
                        <span className="pct-more">
                          แพงกว่า {pctMore.toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="delete"
                      aria-label={`ลบ ${it.name}`}
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
          ล้างทั้งหมด
        </button>
      )}
    </div>
  );
};

export default App;
