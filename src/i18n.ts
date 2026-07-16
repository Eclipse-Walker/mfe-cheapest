import type { Dimension, Unit } from './unitPrice';

export type Lang = 'th' | 'en';

// ponytail: object ธรรมดาแทน i18n library — เพิ่มภาษาใหม่คือเพิ่ม key เดียว
export const MESSAGES = {
  th: {
    title: 'อันไหนถูกสุด?',
    subtitle: 'กรอกราคาและปริมาณ แล้วดูว่าชิ้นไหนคุ้มค่าที่สุด',
    namePlaceholder: 'ชื่อสินค้า (ไม่ใส่ก็ได้)',
    pricePlaceholder: 'ราคา (บาท)',
    qtyPlaceholder: 'ปริมาณ',
    add: 'เพิ่ม',
    empty: 'ยังไม่มีสินค้า — ลองเพิ่มสัก 2 ชิ้นเพื่อเปรียบเทียบ',
    best: 'คุ้มสุด',
    clearAll: 'ล้างทั้งหมด',
    historyButton: 'ประวัติ',
    back: 'กลับ',
    historyEmpty: 'ยังไม่มีประวัติ',
    restore: 'กู้คืน',
    baht: 'บาท',
    autoName: (n: number) => `สินค้า #${n}`,
    moreExpensive: (pct: string) => `แพงกว่า ${pct}%`,
    deleteItem: (name: string) => `ลบ ${name}`,
    dims: {
      mass: 'ตามน้ำหนัก',
      volume: 'ตามปริมาตร',
      count: 'ตามจำนวนชิ้น',
    } satisfies Record<Dimension, string>,
    units: {
      g: 'g',
      kg: 'kg',
      ml: 'ml',
      l: 'L',
      piece: 'ชิ้น',
    } satisfies Record<Unit, string>,
    locale: 'th-TH',
  },
  en: {
    title: 'Which is cheapest?',
    subtitle: 'Enter price and quantity to see which item is the best value',
    namePlaceholder: 'Product name (optional)',
    pricePlaceholder: 'Price (THB)',
    qtyPlaceholder: 'Quantity',
    add: 'Add',
    empty: 'No items yet — add 2 or more to compare',
    best: 'Best value',
    clearAll: 'Clear all',
    historyButton: 'History',
    back: 'Back',
    historyEmpty: 'No history yet',
    restore: 'Restore',
    baht: 'THB',
    autoName: (n: number) => `Item #${n}`,
    moreExpensive: (pct: string) => `${pct}% more expensive`,
    deleteItem: (name: string) => `Delete ${name}`,
    dims: {
      mass: 'By weight',
      volume: 'By volume',
      count: 'By piece',
    } satisfies Record<Dimension, string>,
    units: {
      g: 'g',
      kg: 'kg',
      ml: 'ml',
      l: 'L',
      piece: 'pcs',
    } satisfies Record<Unit, string>,
    locale: 'en-US',
  },
} as const;

export const LANG_KEY = 'lang';

export const loadLang = (): Lang => {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'th' || saved === 'en') return saved;
  return navigator.language.startsWith('th') ? 'th' : 'en';
};
