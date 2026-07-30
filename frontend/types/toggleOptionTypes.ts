export type Season = {
  season: string;
};

export type Position = {
  position: string;
};

export type OptionSelectionToggleBarProps = {
  seasons: Season[];
  positions: Position[];
  selectedSeason: string;
  selectedPositions: string[];
  onSelectedSeasonChange: (season: string) => void;
  onSelectedPosition: (positions: string) => void;
  onFindPlayersClick: (season: string, positions: string[]) => void;
};
