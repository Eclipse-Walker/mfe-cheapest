import { describe, expect, it } from '@rstest/core';
import { formatUnitPrice, UNITS, unitPrice } from './unitPrice';

describe('unitPrice', () => {
  it('แปลง kg เป็น g', () => {
    expect(unitPrice(99, 1.2, 'kg')).toBeCloseTo(0.0825);
  });

  it('แปลง L เป็น ml', () => {
    expect(unitPrice(50, 1, 'l')).toBeCloseTo(0.05);
  });

  it('เทียบข้ามหน่วยแล้วชี้ตัวถูกสุดถูกตัว: 99บ/1.2kg ถูกกว่า 45บ/500g', () => {
    expect(unitPrice(99, 1.2, 'kg')).toBeLessThan(unitPrice(45, 500, 'g'));
  });

  it('ราคาต่อชิ้น', () => {
    expect(unitPrice(120, 12, 'piece')).toBe(10);
  });

  it('แพ็ค: 42บ/แพ็ค 3 กล่อง × 180ml = ราคาต่อ ml จากปริมาณรวม 540ml', () => {
    expect(unitPrice(42, 180, 'ml', 3)).toBeCloseTo(42 / 540);
  });

  it('เทียบนมสองแพ็ค: 60บ/4×225ml ถูกกว่า 42บ/3×180ml', () => {
    expect(unitPrice(60, 225, 'ml', 4)).toBeLessThan(
      unitPrice(42, 180, 'ml', 3),
    );
  });

  it('ไม่ส่ง count หรือส่ง undefined = 1 (ของเก่าใน localStorage)', () => {
    expect(unitPrice(50, 1, 'l', undefined)).toBe(unitPrice(50, 1, 'l'));
  });

  it('dimension ต่างกันไม่ปนกัน', () => {
    expect(UNITS.g.dim).not.toBe(UNITS.ml.dim);
    expect(UNITS.kg.dim).toBe(UNITS.g.dim);
    expect(UNITS.l.dim).toBe(UNITS.ml.dim);
  });
});

describe('formatUnitPrice', () => {
  it('ตัวเลขเล็กขยายเป็น /100g', () => {
    expect(formatUnitPrice(0.09, 'mass')).toBe('9.00 บาท/100g');
  });

  it('ตัวเลขเล็กมากขยายเป็น /L', () => {
    expect(formatUnitPrice(0.005, 'volume')).toBe('5.00 บาท/L');
  });

  it('ตัวเลขใหญ่ใช้หน่วยฐานตรงๆ', () => {
    expect(formatUnitPrice(2.5, 'mass')).toBe('2.50 บาท/g');
    expect(formatUnitPrice(10, 'count')).toBe('10.00 บาท/ชิ้น');
  });

  it('ภาษาอังกฤษ', () => {
    expect(formatUnitPrice(0.09, 'mass', 'en')).toBe('9.00 THB/100g');
    expect(formatUnitPrice(10, 'count', 'en')).toBe('10.00 THB/pcs');
  });
});
