import { render, screen } from '@testing-library/react';
import { Button } from '@ui/Button';
import '@testing-library/jest-dom';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
}); 