import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';
import { Toggle } from '@/design-system';
import styles from './DarkModeToggle.module.css';

export function DarkModeToggle() {
  const { t } = useTranslation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setDark(true);
    }
  }, []);

  function setTheme(next: boolean) {
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <label className={styles.row}>
      <span className={styles.icon}>{dark ? <Moon size={20} /> : <Sun size={20} />}</span>
      <span className={styles.label}>{t('appShell.darkMode')}</span>
      <Toggle checked={dark} onChange={setTheme} />
    </label>
  );
}
