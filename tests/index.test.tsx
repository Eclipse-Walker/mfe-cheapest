import { afterEach, expect, test } from '@rstest/core';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from '../src/App';

afterEach(cleanup);

test('renders the main page', () => {
  localStorage.setItem('lang', 'th');
  render(<App />);
  expect(screen.getByText('อันไหนถูกสุด?')).toBeInTheDocument();
});

test('deleted items can be viewed in history and restored', () => {
  localStorage.clear();
  localStorage.setItem('lang', 'th');
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText('ราคา (บาท)'), {
    target: { value: '45' },
  });
  fireEvent.change(screen.getByPlaceholderText('ปริมาณ'), {
    target: { value: '500' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'เพิ่ม' }));
  expect(screen.getByText('สินค้า #1')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'ลบ สินค้า #1' }));
  expect(screen.queryByText('สินค้า #1')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'ประวัติ' }));
  expect(screen.getByText('สินค้า #1')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'กู้คืน' }));
  fireEvent.click(screen.getByRole('button', { name: 'กลับ' }));

  expect(screen.getByText('สินค้า #1')).toBeInTheDocument();
});
