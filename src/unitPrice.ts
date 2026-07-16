export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'piece';
export type Dimension = 'mass' | 'volume' | 'count';

export const UNITS: Record<
  Unit,
  { dim: Dimension; factor: number; label: string }
> = {
  g: { dim: 'mass', factor: 1, label: 'g' },
  kg: { dim: 'mass', factor: 1000, label: 'kg' },
  ml: { dim: 'volume', factor: 1, label: 'ml' },
  l: { dim: 'volume', factor: 1000, label: 'L' },
  piece: { dim: 'count', factor: 1, label: 'ชิ้น' },
};

/** ราคาต่อหน่วยฐาน (บาท/g, บาท/ml, บาท/ชิ้น) */
export const unitPrice = (price: number, qty: number, unit: Unit): number =>
  price / (qty * UNITS[unit].factor);

/** ราคาต่อหน่วยแบบอ่านง่าย — ขยายเป็น /100g, /L ฯลฯ ถ้าตัวเลขเล็กเกิน */
export const formatUnitPrice = (perBase: number, dim: Dimension): string => {
  const baht = (n: number) =>
    n.toLocaleString('th-TH', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  if (dim === 'count') return `${baht(perBase)} บาท/ชิ้น`;
  const base = dim === 'mass' ? 'g' : 'ml';
  const big = dim === 'mass' ? 'kg' : 'L';
  if (perBase >= 1) return `${baht(perBase)} บาท/${base}`;
  if (perBase >= 0.01) return `${baht(perBase * 100)} บาท/100${base}`;
  return `${baht(perBase * 1000)} บาท/${big}`;
};
