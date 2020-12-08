import { get7daySummary, getDaySummary } from '../../services/summaryService.js'

const summary = async({response}) => {
    response.body = await get7daySummary()
};

const day_summary = async({response, params}) => {
    response.body = await getDaySummary(params.year, params.month, params.day)
};
   
export { summary, day_summary };