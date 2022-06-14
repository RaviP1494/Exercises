--The region of the craigslist post (San Francisco, Atlanta, Seattle, etc)
--Users and preferred region
--Posts: contains title, text, the user who has posted, the location of the posting, the region of the posting
--Categories that each post belongs to

DROP DATABASE IF EXISTS craigslist;

CREATE DATABASE craigslist;

\c craiglist

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(10) UNIQUE NOT NULL,
    first_name VARCHAR(63) NOT NULL,
    last_name VARCHAR(63) NOT NULL,
    pref_reg INTEGER REFERENCES regions (id)
)

CREATE TABLE regions(
    id SERIAL PRIMARY KEY,
    _name VARCHAR(20) NOT NULL
)

CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    _name VARCHAR(20) NOT NULL
)

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    content TEXT,
    loc TEXT NOT NULL,
    user_id INTEGER REFERENCES users (id),
    region_id INTEGER REFERENCES regions(id),
    category_id INTEGER REFERENCES categories(id)
)