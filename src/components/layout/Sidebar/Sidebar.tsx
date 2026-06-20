import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SearchInput } from '@/design-system';
import { Logo } from '@/components/common';
import { cn } from '@/utils/cn';
import { DarkModeToggle } from '../DarkModeToggle';
import { UserBar } from '../UserBar';
import { NAV_ITEMS, getActiveNav } from '../navItems';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { t } = useTranslation();

  const activeQuery = params.get('q') ?? '';
  const [query, setQuery] = useState(activeQuery);

  // Mirror the active search query so the box shows it on the results page and
  // clears once the user navigates away (when there's no longer a `q`).
  useEffect(() => {
    setQuery(activeQuery);
  }, [activeQuery]);

  const activeNav = getActiveNav(pathname);

  function runSearch() {
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.brand}>
        <Logo className={styles.brandLogo} />
        <span className={styles.brandTagline}>{t('brand.tagline')}</span>
      </Link>

      <SearchInput
        className={styles.sidebarSearch}
        value={query}
        onChange={setQuery}
        onSubmit={runSearch}
        placeholder={t('appShell.searchPlaceholder')}
        ariaLabel={t('appShell.searchAria')}
        clearAriaLabel={t('common.clearSearch')}
      />

      <nav className={styles.nav} aria-label={t('appShell.mainNav')}>
        {NAV_ITEMS.map(({ id, icon: Icon, href }) => (
          <Link
            key={id}
            to={href}
            className={cn(styles.navItem, activeNav === id && styles.navItemActive)}
            aria-current={activeNav === id ? 'page' : undefined}
          >
            <span className={cn(styles.navIcon, activeNav === id && styles.navIconActive)}>
              <Icon size={22} />
            </span>
            <span className={styles.navLabel}>{t(`nav.${id}`)}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.navFoot}>
        <DarkModeToggle />
      </div>

      <UserBar />
    </aside>
  );
}
