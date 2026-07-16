import { type Lang, MESSAGES } from './i18n';

export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'piece';
export type Dimension = 'mass' | 'volume' | 'count';

export const UNITS: Record<Unit, { dim: Dimension; factor: number }> = {
  g: { dim: 'mass', factor: 1 },
  kg: { dim: 'mass', factor: 1000 },
  ml: { dim: 'volume', factor: 1 },
  l: { dim: 'volume', factor: 1000 },
  piece: { dim: 'count', factor: 1 },
};

/** ราคาต่อหน่วยฐาน (บาท/g, บาท/ml, บาท/ชิ้น) */
export const unitPrice = (price: number, qty: number, unit: Unit): number =>
  price / (qty * UNITS[unit].factor);

/** ราคาต่อหน่วยแบบอ่านง่าย — ขยายเป็น /100g, /L ฯลฯ ถ้าตัวเลขเล็กเกิน */
export const formatUnitPrice = (
  perBase: number,
  dim: Dimension,
  lang: Lang = 'th',
): string => {
  const t = MESSAGES[lang];
  const baht = (n: number) =>
    `${n.toLocaleString(t.locale, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })} ${t.baht}`;
  if (dim === 'count') return `${baht(perBase)}/${t.units.piece}`;
  const base = dim === 'mass' ? 'g' : 'ml';
  const big = dim === 'mass' ? t.units.kg : t.units.l;
  if (perBase >= 1) return `${baht(perBase)}/${base}`;
  if (perBase >= 0.01) return `${baht(perBase * 100)}/100${base}`;
  return `${baht(perBase * 1000)}/${big}`;
};
