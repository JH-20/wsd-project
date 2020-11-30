import { getSummary, getDaySummary } from '../../services/summaryService.js'

const summary = async({response}) => {
    response.body = await getSummary()
};

const day_summary = async({response, params}) => {
    response.body = await getDaySummary(params.year, params.month, params.day)
};
   
export { summary, day_summary };