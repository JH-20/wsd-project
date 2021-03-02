# wsd-project

This is the self-monitoring app for Aalto WSD course project.
This app was created by Jere Hirviniemi.

The app is currently NOT deployed anywhere like Heroku.

Otherwise the app closely follows the requirements listed here:
https://wsd.cs.aalto.fi/web-software-development/99-course-project/

I find detailed documentation useless, as the user can check how the app works from the link above.
Anything noteworthy is written here though.

I did not add complicated tests that would require a database access, because that would require a new and clean database for running the tests. Also I cannot quarantee the state of a database before the tests without clearing and rebuilding it. I find that would cause more bugs than the tests could prevent.


## Launching the server:

First create a config.env file in the root of the application structure with the following lines filled with the correct information:

(config.env should be gitignored for security and the contents should not be shared publicly)

```
export DATABASE_URL=
export PORT=
```

Then launch the app with:

```
source config.env
sh launch.sh
```

**OR YOU CAN DO THE FOLLOWING**

Run the following lines in terminal with the correct information filled in:

```
export DATABASE_URL=
export PORT=
sh launch.sh
```

If you get the following error, you have forgotten to set the environmental variables

```
Launching the app with:
 > deno run --allow-net --allow-env --allow-read --unstable app.js
Database URL:
undefined
Port:
NaN
error: Uncaught (in promise) InvalidData: data did not match any variant of untagged enum ArgsEnum
```


## Running the tests

```
source config.env
sh test.sh
```


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