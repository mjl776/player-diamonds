import { LoadingSpinnerProps } from '@/types/LoadingSpinnerTypes';
import React, { FC } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from './page.module.css'

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ isLoading, text }) => {
  return (
    <div className={styles.spinnerContainer}>
      {
        isLoading && <div className={styles.loadingText}> { text } </div>
      }
      <ClipLoader color="#0D0D0D" loading={isLoading} size={50} />
    </div>
  );
}