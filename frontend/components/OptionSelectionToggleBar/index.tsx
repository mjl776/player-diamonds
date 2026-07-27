'use client'
import { FC } from 'react';
import styles from './page.module.css'
import './page.module.css'
import { OptionSelectionToggleBarProps } from '@/types/toggleOptionTypes';

export const OptionSelectionToggleBar: FC <OptionSelectionToggleBarProps> = ({
    seasons,
    seasonTypes,
    selectedSeason,
    selectedSeasonType,
    onSelectedSeasonChange,
    onSelectSeasonType,
    onFindPlayersClick,
}) => {
    return (
        <div className={styles.toggleBarContainer}>
                <div className = {styles.seasonSelectionContainer}>
                    <h1> Season </h1>
                    <div className={styles.seasonButtonContainer}>
                        { seasons && seasons.map((season, index) => {
                            return (
                                <button key={`season-${index}`} className={selectedSeason  == season.season ? styles.seasonButtontoggleOptionActive : styles.seasonButtontoggleOption} onClick={() => onSelectedSeasonChange(season.season)}>
                                    {season.season}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className = {styles.seasonSelectionContainer}>
                    <h1 className={styles.seasonsHeader}> Season Type </h1>
                    <div className={styles.seasonButtonContainer}>
                        { seasonTypes && seasonTypes.map((seasonType, index) => {
                            return (
                                <button key={`season-type-${index}`} className={selectedSeasonType  == seasonType.seasonType ? styles.seasonButtontoggleOptionActive : styles.seasonButtontoggleOption} onClick={() => onSelectSeasonType(seasonType.seasonType)}>
                                    {seasonType.seasonType}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <button className={styles.findPlayersButton} onClick={() => onFindPlayersClick(selectedSeason, selectedSeasonType)}> Find Players </button>
        </div>
    );
}