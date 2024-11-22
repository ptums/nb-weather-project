# New Brunswick Weather Project

This project aims to make visualizing historical weather of New Brunswick, NJ easy. It uses OpenMeteo API (all the legal usage stuff coming soon) and can pull dates from 01-1940 to present.

## MVP GOALS

- Deploy

## Post MVP

- Rewrite BE in kotlin
- IndexDB compare sidebar data
- Large dialogue for comparison mode
- 5$ per unique location - session deletes on refresh (stripe)
- analtics (use excalidraws one)
- feature request from

## Opimizations

- Db refactor: multiple user ids per query, so we dont have duplicate entres
- Spike: DB compression/optimzation strategy
- CRON: fetch from open meteo daily to index month/year entries

## legal

- Make software open
- Open meteo legal stuff
