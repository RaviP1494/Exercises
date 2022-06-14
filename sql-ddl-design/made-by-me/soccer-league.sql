DROP DATABASE IF EXISTS soccer_league;

CREATE DATABASE soccer_league;

\c soccer_league;

CREATE TABLE seasons(
    id SERIAL PRIMARY KEY,
    s_date DATE NOT NULL,
    e_date DATE NOT NULL
)

CREATE TABLE teams(
    id SERIAL PRIMARY KEY,
    brand VARCHAR(20) UNIQUE NOT NULL,
    season INTEGER REFERENCES league (id)
)

CREATE TABLE players(
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams (id),
    first_name VARCHAR(20),
    last_name VARCHAR(20) NOT NULL,
    init_season INTEGER REFERENCES seasons (id)
)

CREATE TABLE referees(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(20),
    last_name VARCHAR(20)
)

CREATE TABLE matches(
    id SERIAL PRIMARY KEY,
    h_team_id INTEGER REFERENCES teams (id),
    a_team_id INTEGER REFERENCES teams (id),
    _date DATE NOT NULL,
    ref_id INTEGER REFERENCES referees (id),
    season INTEGER REFERENCES league (id)
)

CREATE TABLE goals(
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players (id),
    match_id INTEGER REFERENCES matches (id),
    team_id INTEGER REFERENCES teams (id)
)