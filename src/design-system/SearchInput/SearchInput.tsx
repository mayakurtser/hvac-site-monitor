import { useRef } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/design-system/primitives/Input';
import { cn } from '@/utils/cn';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  clearAriaLabel?: string;
  size?: 'sm' | 'md';
  grow?: boolean;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  ariaLabel,
  clearAriaLabel = 'Clear search',
  size = 'sm',
  grow,
  className,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    onChange('');
    inputRef.current?.focus();
  }

  return (
    <form
      className={cn(styles.form, grow && styles.grow, className)}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
    >
      <Input
        iconLeading="search"
        size={size}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        inputRef={inputRef}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onSubmit ? (e) => { if (e.key === 'Tab') onSubmit(value); } : undefined}
        trailing={value.length > 0 ? (
          <button type="button" className={styles.clear} aria-label={clearAriaLabel} onClick={handleClear}>
            <X size={16} />
          </button>
        ) : undefined}
      />
    </form>
  );
}
