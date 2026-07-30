# Overview

This is a README for the backend of Player Diamonds

# Language

TypeScript

# Framework

NestJS

# Hosting

Railway

## Endpoints

/find-undervalued players

Surfaces undervalued players, takes a season, seasonType, and a array of postions as arguments and
outputs players who have 2 standard deviations over the

E.G. localhost query:

curl -G "http://localhost:8080/find-undervalued-players" \
--data-urlencode "season=2023-24" \
--data-urlencode "seasonType=Regular Season" \
--data-urlencode "positions=G" \
--data-urlencode "positions=F" \
--data-urlencode "positions=C" \
--data-urlencode "positions=F-C" \
--data-urlencode "positions=G-F"

## Ingestions / Scripts

The ingestions folder hosts the python scripts that are run for ingestions of data. It specifically pulls data into my postgres db in Supabase, which is used for my queries on the backend. They call different endpoints in the NBA_API and stores this data in my database.

The scripts folder is used to run ingestions of existing data in my DB for computing stats such as NBA League Averages across different player positons

