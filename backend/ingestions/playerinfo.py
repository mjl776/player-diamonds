import argparse
import sys
import os
import uuid

from pandas import DataFrame

from sqlalchemy import create_engine
from sqlalchemy.dialects.postgresql import insert as pg_insert

from nba_api.stats.endpoints import playerindex

def get_engine():
    url = os.environ.get("DATABASE_URL")
    if not url:
        sys.exit("DATABASE_URL not set. Export the direct Postgres connection string.")

    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)

    return create_engine(url)

def get_player_stat_rows(season: str) -> DataFrame:

    idx = playerindex.PlayerIndex(
        season=season,       # format 'YYYY-YY'
        league_id="00",      # '00' = NBA (default)
    )
    df = idx.get_data_frames()[0]
    return df

def generate_uuids(df: DataFrame) -> DataFrame:
    uuid_list = [str(uuid.uuid4()) for _ in range(len(df))]
    return uuid_list

def _upsert_on_conflict_nothing(table, conn, keys, data_iter):
    data = [dict(zip(keys, row)) for row in data_iter]
    stmt = pg_insert(table.table).values(data)
    stmt = stmt.on_conflict_do_nothing(index_elements=['person_id'])
    conn.execute(stmt)

def insert_player_info_to_db(df: DataFrame, season: str):
    engine = get_engine()
    df.columns = df.columns.str.lower()
    uuids = generate_uuids(df)

    df['id'] = uuids

    # Drop columns that are not needed for player info
    df = df.drop(columns=['pts', 'reb', 'ast'])

    df.to_sql('player_info', engine, if_exists='append', index=False, method=_upsert_on_conflict_nothing)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--season", type=str, required=True,
                help="Season(s) to use, e.g. --seasons 2023-24")
    args = ap.parse_args()
    df_player_info = get_player_stat_rows(args.season)
    insert_player_info_to_db(df_player_info, args.season)

if __name__ == "__main__":
    main()




