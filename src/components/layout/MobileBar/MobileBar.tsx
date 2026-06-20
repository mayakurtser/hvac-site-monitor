import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/common';
import { cn } from '@/utils/cn';
import collieAvatar from '@/assets/border-collie.png';
import { DarkModeToggle } from '../DarkModeToggle';
import { NAV_ITEMS, getActiveNav } from '../navItems';
import styles from './MobileBar.module.css';

export function MobileBar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const activeNav = getActiveNav(pathname);

  return (
    <div className={styles.mobileBar}>
      <Link to="/" className={styles.mobileBrand}>
        <Logo className={styles.mobileBrandLogo} />
      </Link>

      <div className={styles.actions}>
        <nav className={styles.nav} aria-label={t('appShell.mainNav')}>
          {NAV_ITEMS.map(({ id, icon: Icon, href }) => (
            <Link
              key={id}
              to={href}
              className={cn(styles.navItem, activeNav === id && styles.navItemActive)}
              aria-label={t(`nav.${id}`)}
              aria-current={activeNav === id ? 'page' : undefined}
            >
              <Icon size={20} />
            </Link>
          ))}
        </nav>
        <DarkModeToggle />
        <img className={styles.avatar} src={collieAvatar} alt="" width={32} height={32} />
      </div>
    </div>
  );
}
