import React from 'react';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
    const avatarSrc = avatarUrl ? `http://localhost:4444${avatarUrl}` : '/noavatar.png';

  return (
      <div className={styles.root}>
          <img className={styles.avatar} src={avatarSrc} alt={fullName}/>

          <div className={styles.userDetails}>
              <span className={styles.userName}>{fullName}</span>
              <span className={styles.additional}>{additionalText}</span>
          </div>
      </div>
  );
};
