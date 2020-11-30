import { validate, required, numberBetween, isEmail, minNumber,
        isNumber, isInt, isDate, match } from '../../deps.js'
import { executeQuery } from '../../database/database.js'
import { getUserWeekSummary, getUserMonthSummary } from '../../services/summaryService.js'

const USER_ID = 1; // TODO replace

const get_report = async({render}) => {
  render('report.ejs');
}

const get_report_m = async({render}) => {
  render('morning_r.ejs')
}

const post_report_m = async({request, response, render}) => {
  console.log('--- Morning report POST ---')
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
    hours_slept: [required, isNumber, minNumber(0)],
    sleep_quality: [required, numberBetween(1,5), isInt],
    mood: [required, numberBetween(1,5), isInt]
  }

  const [passes, errors] = await validate(data, validationRules)
  console.log(passes)
  console.log(errors)

  if (!passes) {
    render('morning_r.ejs', {errors: errors})
    return
  }

  await executeQuery("INSERT INTO morning_reports (date, hours_slept, sleep_quality, mood, user_id) VALUES ($1, $2, $3, $4, $5);",
    data.date,
    data.hours_slept,
    data.sleep_quality,
    data.mood,
    USER_ID
  );

  // TODO Set user session message to "Your report has been recorded"
  response.redirect('/')
}

const get_report_e = async({render}) => {
  render('evening_r.ejs')
}

const post_report_e = async({response, request, render}) => {
  console.log('--- Evening report POST ---')
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
    sports_time: [required, isNumber, minNumber(0)],
    study_time: [required, isNumber, minNumber(0)],
    eating: [required, numberBetween(1,5), isInt],
    mood: [required, numberBetween(1,5), isInt]
  }

  const [passes, errors] = await validate(data, validationRules)
  console.log(passes)
  console.log(errors)

  if (!passes) {
    render('evening_r.ejs', {errors: errors})
    return
  }

  await executeQuery("INSERT INTO evening_reports (date, sports_time, study_time, eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6);",
    data.date,
    data.sports_time,
    data.study_time,
    data.eating,
    data.mood,
    USER_ID
  );

  // TODO Set user session message to "Your report has been recorded"
  response.redirect('/')
}

const get_summary = async({response, render}) => {
  
  
  //await getUserWeekSummary(USER_ID, 2020, 48)
  render('summary.ejs')
}

const get_summary_weekly = async({render}) => {
  const today = new Date()
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  var week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  var year = today.getFullYear()
  const summary = await getUserWeekSummary(USER_ID, year, week)
  render('summary_weekly.ejs', {...summary, year: year, week: week})
}

const post_summary_weekly = async({request, render}) => {
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

  const summary = await getUserWeekSummary(USER_ID, year, week)
  render('summary_weekly.ejs', {...summary, year: year, week: week})
}

const get_summary_monthly = async({render}) => {
  const today = new Date()
  const month = today.getMonth() < 9 
              ? '0' + (today.getMonth() + 1) 
              : (today.getMonth() + 1)
  const year = today.getFullYear()
  const summary = await getUserMonthSummary(USER_ID, year, month)
  render('summary_monthly.ejs', {...summary, year: year, month: month})
}

const post_summary_monthly = async({request, render}) => {
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
  
  const summary = await getUserMonthSummary(USER_ID, year, month)
  render('summary_monthly.ejs', {...summary, year: year, month: month})
}
 
export { get_report, get_report_m, post_report_m, get_report_e, post_report_e, get_summary, get_summary_weekly, post_summary_weekly, get_summary_monthly, post_summary_monthly };