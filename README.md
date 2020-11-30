# wsd-project

Self-monitoring app

## Launching the server:

`sh launch.sh`

## Preparing databases
### User database
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));
```
### Morning report database
```
CREATE TABLE morning_reports (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  hours_slept NUMERIC,
  sleep_quality INTEGER,
  mood INTEGER,
  user_id INTEGER REFERENCES users(id)
);
```
### Evening report database
```
CREATE TABLE evening_reports (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  sports_time NUMERIC,
  study_time NUMERIC,
  eating INTEGER,
  mood INTEGER,
  user_id INTEGER REFERENCES users(id)
);
```