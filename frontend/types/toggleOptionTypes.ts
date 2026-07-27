
export type Season = {
    season: string;
}

export type SeasonType = {
    seasonType: string;
}

export type OptionSelectionToggleBarProps = {
    seasons: Season[];
    seasonTypes: SeasonType[];
    selectedSeason: string;
    selectedSeasonType: string;
    onSelectedSeasonChange: (season: string) => void;
    onSelectSeasonType: (seasonType: string) => void;
    onFindPlayersClick: (season: string, seasonType: string) => void;
}