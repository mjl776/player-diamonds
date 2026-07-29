import React from 'react';
import styles  from './page.module.css';

export const Homepage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}> Welcome to the Player Diamonds! </div>
            <p className={styles.subheader}> Where you can find players who are diamonds in the rough. </p>
        </div>
    );
};