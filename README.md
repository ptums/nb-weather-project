# New Brunswick Weather Project

This project aims to make visualizing historical weather of New Brunswick, NJ easy. It uses OpenMeteo API (all the legal usage stuff coming soon) and can pull dates from 01-1940 to present.

## Post MVP

### Comparison Mode

- Clean up bargraph view
- Make it in a large pop up modal

## Beta

- Create a desktop shell
  -- It stores a list of an app list manifest and lists their details in a sidebar
  -- When I get NB Weather in a good place. I want to start family tree builder.
  -- I want to be able to toggle between these apps

## Opimizations

- Db refactor: multiple user ids per query, so we dont have duplicate entres
- Spike: DB compression/optimzation strategy
- CRON: fetch from open meteo daily to index month/year entries
- Make it a PWA that works offline first
