import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SearchInput } from '../SearchInput';

describe('SearchInput', () => {
  it('reports each typed character through onChange', async () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} ariaLabel="Search" />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Search' }), 'a');

    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('submits the current value on Enter', async () => {
    const onSubmit = vi.fn();
    render(<SearchInput value="acme" onChange={() => {}} onSubmit={onSubmit} ariaLabel="Search" />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Search' }), '{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('acme');
  });

  it('submits the current value when tabbing out', async () => {
    const onSubmit = vi.fn();
    render(<SearchInput value="acme" onChange={() => {}} onSubmit={onSubmit} ariaLabel="Search" />);

    await userEvent.click(screen.getByRole('textbox', { name: 'Search' }));
    await userEvent.tab();

    expect(onSubmit).toHaveBeenCalledWith('acme');
  });

  it('does not wire submit-on-tab when no onSubmit is provided', async () => {
    render(<SearchInput value="acme" onChange={() => {}} ariaLabel="Search" />);

    await userEvent.click(screen.getByRole('textbox', { name: 'Search' }));
    await userEvent.tab();

    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('hides the clear button when the value is empty', () => {
    render(
      <SearchInput value="" onChange={() => {}} ariaLabel="Search" clearAriaLabel="Clear search" />,
    );

    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('shows the clear button when there is a value', () => {
    render(
      <SearchInput
        value="acme"
        onChange={() => {}}
        ariaLabel="Search"
        clearAriaLabel="Clear search"
      />,
    );

    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('clears the value when the clear button is clicked', async () => {
    const onChange = vi.fn();
    render(
      <SearchInput
        value="acme"
        onChange={onChange}
        ariaLabel="Search"
        clearAriaLabel="Clear search"
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('does not submit when the clear button is clicked', async () => {
    const onSubmit = vi.fn();
    render(
      <SearchInput
        value="acme"
        onChange={() => {}}
        onSubmit={onSubmit}
        ariaLabel="Search"
        clearAriaLabel="Clear search"
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('returns focus to the input after clearing', async () => {
    render(
      <SearchInput
        value="acme"
        onChange={() => {}}
        ariaLabel="Search"
        clearAriaLabel="Clear search"
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
  });

  it('falls back to a default accessible name for the clear button', () => {
    render(<SearchInput value="acme" onChange={() => {}} ariaLabel="Search" />);

    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });
});
