import { getUserMood } from '../../services/summaryService.js'

const USER_ID = 1 // TODO replace

const get_root = async({render}) => {
  var d = new Date()
  const today = await getUserMood(USER_ID, d.getFullYear(), d.getMonth()+1, d.getDate())
  d.setDate(d.getDate() - 1);
  const yesterday = await getUserMood(USER_ID, d.getFullYear(), d.getMonth()+1, d.getDate())
  render('root.ejs', {average_mood_today: today, average_mood_yesterday: yesterday});
};
 
export { get_root };