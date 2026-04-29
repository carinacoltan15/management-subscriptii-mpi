import { render, screen } from '@testing-library/react';
import App from './App';

test('verifică dacă titlul aplicației apare corect', () => {
  render(<App />);
  const titluElement = screen.getByText(/SubMng.io/i);
  expect(titluElement).toBeInTheDocument();
});

test('verifică dacă există butonul de salvare', () => {
  render(<App />);
  const butonSalveaza = screen.getByRole('button', { name: /SALVEAZĂ/i });
  expect(butonSalveaza).toBeInTheDocument();
});