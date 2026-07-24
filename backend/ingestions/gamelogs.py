import argparse
import sys
import os
import uuid

from pandas import DataFrame
from nba_api.stats.endpoints import leaguegamelog
from sqlalchemy import create_engine

def get_engine():
    url = os.environ.get("DATABASE_URL")
    if not url:
        sys.exit("DATABASE_URL not set. Export the direct Postgres connection string.")

    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)

    return create_engine(url)

def get_game_log_rows(season: str, season_type: str) -> DataFrame:

    logs = leaguegamelog.LeagueGameLog(
        season=season,
        season_type_all_star=season_type, # or 'Playoffs', 'Pre Season'
        player_or_team_abbreviation='P', # 'P' = player rows, 'T' = team rows
    )
    df = logs.get_data_frames()[0]
    return df

def generate_uuids(df: DataFrame) -> DataFrame:
    uuid_list = [str(uuid.uuid4()) for _ in range(len(df))]
    return uuid_list

def insert_game_logs_to_db(df: DataFrame, season: str, season_type: str = "Regular Season"):
    engine = get_engine()
    df.columns = df.columns.str.lower()
    uuids = generate_uuids(df)

    df['id'] = uuids
    df['season'] = season
    df['season_type'] = season_type
    df.to_sql('player_game_logs', engine, if_exists='append', index=False)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--season", type=str, required=True,
                help="Season(s) to use, e.g. --seasons 2023-24")
    ap.add_argument("--season_type", type=str, default="Regular Season",
                help="Season type to use, e.g. --season_type 'Regular Season' or 'Playoffs...'")
    args = ap.parse_args()
    df_player_game_stats = get_game_log_rows(args.season, args.season_type)
    insert_game_logs_to_db(df_player_game_stats, args.season, args.season_type)

if __name__ == "__main__":
    main()




