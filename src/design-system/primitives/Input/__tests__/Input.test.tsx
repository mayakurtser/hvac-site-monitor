import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../Input';

describe('Input', () => {
  it('renders the trailing slot inside the field', () => {
    render(<Input aria-label="Query" trailing={<button type="button">clear</button>} />);

    expect(screen.getByRole('textbox', { name: 'Query' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
  });

  it('renders no trailing element when trailing is omitted', () => {
    render(<Input aria-label="Query" />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('forwards inputRef to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Query" inputRef={ref} />);

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Query' }));
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
