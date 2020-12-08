import { executeQuery } from "../database/database.js";

const null_morning = {
  average_sleep_duration: null,
  average_sleep_quality: null,
  average_mood_morning: null
}

const null_evening = {
  average_sports_time: null,
  average_study_time: null,
  average_eating_quality: null,
  average_mood_evening: null
}

const getDateFormated = (year, month, day) => {
  var day_ = day < 10
              ? '0' + day
              : day
  var month_ = month < 10
              ? '0' + month
              : month
  return year+"-"+month_+"-"+day_
}

// Summary of all user data
const get7daySummary = async() => {
  var morning = await executeQuery("SELECT AVG(hours_slept)::numeric(10,2) as average_sleep_duration, AVG(sleep_quality)::numeric(10,2) as average_sleep_quality, AVG(mood)::numeric(10,2) as average_mood_morning FROM morning_reports WHERE date > current_date - interval '7 days'");
  var evening = await executeQuery("SELECT AVG(sports_time)::numeric(10,2) as average_sports_time, AVG(study_time)::numeric(10,2) as average_study_time, AVG(eating)::numeric(10,2) as average_eating_quality, AVG(mood)::numeric(10,2) as average_mood_evening FROM evening_reports WHERE date > current_date - interval '7 days'");
  var totalmood = await executeQuery("SELECT AVG(mood)::numeric(10,2) as average_mood_whole_day FROM (SELECT mood, date FROM morning_reports UNION SELECT mood, date FROM evening_reports) as foo WHERE date > current_date - interval '7 days'");
  
  if (!morning || morning.rowCount === 0) {
    morning = null_morning
  } else {
    morning = morning.rowsOfObjects()[0]
  }
  if (!evening || evening.rowCount === 0) {
    evening = null_evening
  } else {
    evening = evening.rowsOfObjects()[0]
  }
  if (!totalmood || totalmood.rowCount === 0) {
    totalmood = {average_mood_whole_day: null}
  } else {
    totalmood = totalmood.rowsOfObjects()[0]
  }
  
  const summary = {
    ...morning,
    ...evening,
    ...totalmood
  }
  //console.log("- Summary -")
  //console.log(summary)
  return summary
}

// Summary of all user data for specific date (year, month, day)
const getDaySummary = async(year, month, day) => {
  var date = getDateFormated(year, month, day)
  var morning = await executeQuery("SELECT AVG(hours_slept)::numeric(10,2) as average_sleep_duration, AVG(sleep_quality)::numeric(10,2) as average_sleep_quality, AVG(mood)::numeric(10,2) as average_mood_morning FROM morning_reports WHERE date = $1", date);
  var evening = await executeQuery("SELECT AVG(sports_time)::numeric(10,2) as average_sports_time, AVG(study_time)::numeric(10,2) as average_study_time, AVG(eating)::numeric(10,2) as average_eating_quality, AVG(mood)::numeric(10,2) as average_mood_evening FROM evening_reports WHERE date = $1", date);
  var totalmood = await executeQuery("SELECT AVG(mood)::numeric(10,2) as average_mood_whole_day FROM (SELECT mood, date FROM morning_reports UNION SELECT mood, date FROM evening_reports) as foo WHERE date =  $1", date);
  
  if (!morning || morning.rowCount === 0) {
    morning = null_morning
  } else {
    morning = morning.rowsOfObjects()[0]
  }
  if (!evening || evening.rowCount === 0) {
    evening = null_evening
  } else {
    evening = evening.rowsOfObjects()[0]
  }
  if (!totalmood || totalmood.rowCount === 0) {
    totalmood = {average_mood_whole_day: null}
  } else {
    totalmood = totalmood.rowsOfObjects()[0]
  }
  
  const summary = {
    ...morning,
    ...evening,
    ...totalmood
  }
  //console.log("- Summary -")
  //console.log(summary)
  return summary
}

// Summary of specific users data for a specific week
const getUserWeekSummary = async(user_id, year, week) => {
  var morning = await executeQuery(
    `SELECT AVG(hours_slept)::numeric(10,2) as average_sleep_duration, AVG(sleep_quality)::numeric(10,2) as average_sleep_quality, AVG(mood)::numeric(10,2) as average_mood_morning
    FROM (SELECT t1.*, DATE_PART('week',date) as week, DATE_PART('year',date) as year FROM morning_reports as t1 WHERE user_id = $3) as foo
    WHERE year = $1 AND week = $2`, year, week, user_id)
  var evening = await executeQuery(
    `SELECT AVG(sports_time)::numeric(10,2) as average_sports_time, AVG(study_time)::numeric(10,2) as average_study_time, AVG(eating)::numeric(10,2) as average_eating_quality, AVG(mood)::numeric(10,2) as average_mood_evening
    FROM (SELECT t1.*, DATE_PART('week',date) as week, DATE_PART('year',date) as year FROM evening_reports as t1 WHERE user_id = $3) as foo
    WHERE year = $1 AND week = $2`, year, week, user_id)
  var totalmood = await executeQuery(
    `SELECT AVG(mood)::numeric(10,2) as average_mood_whole_day 
    FROM (SELECT mood, DATE_PART('week',date) as week, DATE_PART('year',date) as year FROM morning_reports WHERE user_id = $3
          UNION 
          SELECT mood, DATE_PART('week',date) as week, DATE_PART('year',date) as year FROM evening_reports WHERE user_id = $3) as foo 
    WHERE year = $1 AND week = $2`, year, week, user_id)

  if (!morning || morning.rowCount === 0) {
    morning = null_morning
  } else {
    morning = morning.rowsOfObjects()[0]
  }
  if (!evening || evening.rowCount === 0) {
    evening = null_evening
  } else {
    evening = evening.rowsOfObjects()[0]
  }
  if (!totalmood || totalmood.rowCount === 0) {
    totalmood = {average_mood_whole_day: null}
  } else {
    totalmood = totalmood.rowsOfObjects()[0]
  }
  
  const summary = {
    ...morning,
    ...evening,
    ...totalmood
  }
  //console.log("- Summary -")
  //console.log(summary)
  return summary
}

// Summary of specific users specific month data
const getUserMonthSummary = async(user_id, year, month) => {
  var morning = await executeQuery(
    `SELECT AVG(hours_slept)::numeric(10,2) as average_sleep_duration, AVG(sleep_quality)::numeric(10,2) as average_sleep_quality, AVG(mood)::numeric(10,2) as average_mood_morning
    FROM (SELECT t1.*, DATE_PART('month',date) as month, DATE_PART('year',date) as year FROM morning_reports as t1 WHERE user_id = $3) as foo
    WHERE year = $1 AND month = $2`, year, month, user_id)
  var evening = await executeQuery(
    `SELECT AVG(sports_time)::numeric(10,2) as average_sports_time, AVG(study_time)::numeric(10,2) as average_study_time, AVG(eating)::numeric(10,2) as average_eating_quality, AVG(mood)::numeric(10,2) as average_mood_evening
    FROM (SELECT t1.*, DATE_PART('month',date) as month, DATE_PART('year',date) as year FROM evening_reports as t1 WHERE user_id = $3) as foo
    WHERE year = $1 AND month = $2`, year, month, user_id)
  var totalmood = await executeQuery(
    `SELECT AVG(mood)::numeric(10,2) as average_mood_whole_day 
    FROM (SELECT mood, DATE_PART('month',date) as month, DATE_PART('year',date) as year FROM morning_reports WHERE user_id = $3
          UNION 
          SELECT mood, DATE_PART('month',date) as month, DATE_PART('year',date) as year FROM evening_reports WHERE user_id = $3) as foo 
    WHERE year = $1 AND month = $2`, year, month, user_id)

  if (!morning || morning.rowCount === 0) {
    morning = null_morning
  } else {
    morning = morning.rowsOfObjects()[0]
  }
  if (!evening || evening.rowCount === 0) {
    evening = null_evening
  } else {
    evening = evening.rowsOfObjects()[0]
  }
  if (!totalmood || totalmood.rowCount === 0) {
    totalmood = {average_mood_whole_day: null}
  } else {
    totalmood = totalmood.rowsOfObjects()[0]
  }

  const summary = {
    ...morning,
    ...evening,
    ...totalmood
  }
  //console.log("- Summary -")
  //console.log(summary)
  return summary
}

const getUserMood = async(user_id, year, month, day) => {
  var date = getDateFormated(year, month, day)
  var totalmood = await executeQuery("SELECT AVG(mood)::numeric(10,2) as average_mood_whole_day FROM (SELECT mood, date FROM morning_reports WHERE user_id = $2 UNION SELECT mood, date FROM evening_reports WHERE user_id = $2) as foo WHERE date =  $1", date, user_id);
  if (!totalmood || totalmood.rowCount === 0) {
    totalmood = {average_mood_whole_day: null}
  } else {
    totalmood = totalmood.rowsOfObjects()[0]
  }
  return totalmood.average_mood_whole_day
}

export { get7daySummary, getDaySummary, getUserWeekSummary, getUserMonthSummary, getUserMood };