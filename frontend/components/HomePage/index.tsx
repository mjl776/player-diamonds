import React from 'react';
import styles  from './page.module.css';

export const Homepage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}> Welcome to the Homepage! </div>
            <p className={styles.subheader}> This is the main landing page of our application. </p>
        </div>
    );
};