export function SeasonAndSeasonTypeCheck(
  season: string,
  seasonType: string,
): boolean {
  if (!season || !seasonType) {
    return false;
  }
  return true;
}
