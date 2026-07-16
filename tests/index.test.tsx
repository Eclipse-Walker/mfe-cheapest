import { expect, test } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders the main page', () => {
  localStorage.setItem('lang', 'th');
  render(<App />);
  expect(screen.getByText('🛒 อันไหนถูกสุด?')).toBeInTheDocument();
});
