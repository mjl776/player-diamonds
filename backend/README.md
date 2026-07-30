# Overview

Backend for Project

curl -G "http://localhost:8080/find-undervalued-players" \
--data-urlencode "season=2023-24" \
--data-urlencode "seasonType=Regular Season" \
--data-urlencode "positions=G" \
--data-urlencode "positions=F" \
--data-urlencode "positions=C" \
--data-urlencode "positions=F-C" \
--data-urlencode "positions=G-F"
