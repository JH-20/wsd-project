import { validate, required, numberBetween,
        isNumber, isInt, isDate, match } from '../../deps.js'
import { executeQuery } from '../../database/database.js'
import { getUserWeekSummary, getUserMonthSummary } from '../../services/summaryService.js'

const get_report = async({render}) => {
  render('report.ejs');
}

const get_report_m = async({render}) => {
  render('morning_r.ejs')
}

const post_report_m = async({request, response, render, session}) => {
  console.log('--- Morning report POST ---')
  const user = await session.get('user');
  const user_id = user.id
  const body = request.body()
  const params = await body.value

  const data = {}
  data.date = params.get('date')
  data.hours_slept = Number(params.get('hours_slept'))
  data.sleep_quality = Number(params.get('sleep_quality'))
  data.mood = Number(params.get('mood'))

  console.log("Got following data")
  console.log(data)

  const validationRules = {
    date: [required, isDate, match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)],
    hours_slept: [required, isNumber, numberBetween(0,24)],
    sleep_quality: [required, numberBetween(1,5), isInt],
    mood: [required, numberBetween(1,5), isInt]
  }

  const [passes, errors] = await validate(data, validationRules)
  console.log(passes)
  console.log(errors)

  if (!passes) {
    render('morning_r.ejs', {...data, errors: errors})
    return
  }

  const existing = await executeQuery("SELECT * FROM morning_reports WHERE date = $1 AND user_id = $2;", data.date, user_id)
  if (existing && existing.rowCount > 0) {
    // Update existing report
    console.log("--- Update ---")
    await executeQuery("UPDATE morning_reports SET (hours_slept, sleep_quality, mood) = ($1, $2, $3) WHERE date = $4 AND user_id = $5;",
      data.hours_slept,
      data.sleep_quality,
      data.mood,
      data.date,
      user_id
    );
    await session.set('msg', `Your morning report for ${data.date} has been updated`)
  } else {
    // Insert new report
    console.log("--- Insert ---")
    await executeQuery("INSERT INTO morning_reports (date, hours_slept, sleep_quality, mood, user_id) VALUES ($1, $2, $3, $4, $5);",
      data.date,
      data.hours_slept,
      data.sleep_quality,
      data.mood,
      user_id
    );
    await session.set('msg', `Your morning report for ${data.date} has been recorded`)
  }

  response.redirect('/')
}

const get_report_e = async({render}) => {
  render('evening_r.ejs')
}

const post_report_e = async({response, request, render, session}) => {
  console.log('--- Evening report POST ---')
  const user = await session.get('user');
  const user_id = user.id
  const body = request.body()
  const params = await body.value

  const data = {}
  data.date = params.get('date')
  data.sports_time = Number(params.get('sports_time'))
  data.study_time = Number(params.get('study_time'))
  data.eating = Number(params.get('eating'))
  data.mood = Number(params.get('mood'))

  console.log("Got following data")
  console.log(data)

  const validationRules = {
    date: [required, isDate, match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)],
    sports_time: [required, isNumber, numberBetween(0,24)],
    study_time: [required, isNumber, numberBetween(0,24)],
    eating: [required, numberBetween(1,5), isInt],
    mood: [required, numberBetween(1,5), isInt]
  }

  const [passes, errors] = await validate(data, validationRules)
  console.log(passes)
  console.log(errors)

  if (!passes) {
    render('evening_r.ejs', {...data, errors: errors})
    return
  }

  const existing = await executeQuery("SELECT * FROM morning_reports WHERE date = $1 AND user_id = $2;", data.date, user_id)
  if (existing && existing.rowCount > 0) {
    // Update existing report
    console.log("--- Update ---")
    await executeQuery("UPDATE evening_reports SET (sports_time, study_time, eating, mood) = ($1, $2, $3, $4) WHERE date = $5 AND user_id = $6;",
      data.sports_time,
      data.study_time,
      data.eating,
      data.mood,
      data.date,
      user_id
    );
    await session.set('msg', `Your evening report for ${data.date} has been updated`)
  } else {
    // Insert new report
    console.log("--- Insert ---")
    await executeQuery("INSERT INTO evening_reports (date, sports_time, study_time, eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6);",
      data.date,
      data.sports_time,
      data.study_time,
      data.eating,
      data.mood,
      user_id
    );
    await session.set('msg', `Your evening report for ${data.date} has been recorded`)
  }

  response.redirect('/')
}

const get_summary = async({render}) => {
  render('summary.ejs')
}

const get_summary_weekly = async({render, session}) => {
  const user = await session.get('user');
  const user_id = user.id
  const today = new Date()
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  var week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  var year = today.getFullYear()
  const summary = await getUserWeekSummary(user_id, year, week)
  render('summary_weekly.ejs', {...summary, year: year, week: week})
}

const post_summary_weekly = async({request, render, session}) => {
  const user = await session.get('user');
  const user_id = user.id
  const body = request.body()
  const params = await body.value

  const today = new Date()
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  var week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  var year = today.getFullYear()

  if (params.has('week')) {
    const yyyy_Www = params.get('week')
    year = Number(yyyy_Www.slice(0,4))
    week = Number(yyyy_Www.slice(6,8))
  }

  const summary = await getUserWeekSummary(user_id, year, week)
  render('summary_weekly.ejs', {...summary, year: year, week: week})
}

const get_summary_monthly = async({render, session}) => {
  const user = await session.get('user');
  const user_id = user.id
  const today = new Date()
  const month = today.getMonth() < 9 
              ? '0' + (today.getMonth() + 1) 
              : (today.getMonth() + 1)
  const year = today.getFullYear()
  const summary = await getUserMonthSummary(user_id, year, month)
  render('summary_monthly.ejs', {...summary, year: year, month: month})
}

const post_summary_monthly = async({request, render, session}) => {
  const user = await session.get('user');
  const user_id = user.id
  const body = request.body()
  const params = await body.value

  const today = new Date()
  var month = today.getMonth() < 9 
              ? '0' + (today.getMonth() + 1) 
              : (today.getMonth() + 1)
  var year = today.getFullYear()

  if (params.has('month')) {
    const yyyy_mm = params.get('month')
    year = Number(yyyy_mm.slice(0,4))
    month = Number(yyyy_mm.slice(5,7))
  }
  
  const summary = await getUserMonthSummary(user_id, year, month)
  render('summary_monthly.ejs', {...summary, year: year, month: month})
}
 
export { get_report, get_report_m, post_report_m, get_report_e, post_report_e, get_summary, get_summary_weekly, post_summary_weekly, get_summary_monthly, post_summary_monthly };