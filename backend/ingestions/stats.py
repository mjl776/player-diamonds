import argparse
import sys
import os

from pandas import DataFrame
from nba_api.stats.endpoints import leaguedashplayerstats
from sqlalchemy import create_engine

def get_engine():
    url = os.environ.get("DATABASE_URL")
    if not url:
        sys.exit("DATABASE_URL not set. Export the direct Postgres connection string.")

    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)

    return create_engine(url)

def get_player_stat_rows(season: str):
    stats = leaguedashplayerstats.LeagueDashPlayerStats(
        season=season, # format: 'YYYY-YY'
        season_type_all_star='Regular Season', # or 'Playoffs', 'Pre Season'
        per_mode_detailed='PerGame', # or 'Totals', 'Per36', etc.
    )
    df = stats.get_data_frames()[0]
    return df

def insert_stats_to_db(df: DataFrame, season: str, season_type: str = "Regular Season"):
    engine = get_engine()
    df.columns = df.columns.str.lower()
    df['season'] = season
    df['season_type'] = season_type
    df.to_sql('player_stats', engine, if_exists='append', index=False)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--season", type=str, required=True,
                help="Season(s) to use, e.g. --seasons 2023-24")
    ap.add_argument("--season-type", type=str, default="Regular Season")
    args = ap.parse_args()
    df_player_stats = get_player_stat_rows(args.season)
    insert_stats_to_db(df_player_stats, args.season)

if __name__ == "__main__":
    main()
