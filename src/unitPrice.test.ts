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
});
