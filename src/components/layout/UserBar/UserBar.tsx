import collieAvatar from '@/assets/border-collie.png';
import styles from './UserBar.module.css';

export function UserBar() {
  return (
    <div className={styles.userBar}>
      <img className={styles.avatar} src={collieAvatar} alt="" width={36} height={36} />
      <div className={styles.userInfo}>
        <div className={styles.userName}>Border Collie</div>
        <div className={styles.userRole}>Chief Treat Officer</div>
      </div>
    </div>
  );
}
