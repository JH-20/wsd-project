import { getUserMood } from '../../services/summaryService.js'

const USER_ID = 1 // TODO replace

const get_root = async({render, session}) => {
  const user = await session.get('user');
  const user_id = user.id

  var d = new Date()
  const today = await getUserMood(user_id, d.getFullYear(), d.getMonth()+1, d.getDate())
  d.setDate(d.getDate() - 1);
  const yesterday = await getUserMood(user_id, d.getFullYear(), d.getMonth()+1, d.getDate())

  const msg = await session.get('msg');
  await session.set('msg', '')

  render('root.ejs', {email: user.email, msg: msg, average_mood_today: today, average_mood_yesterday: yesterday});
};
 
export { get_root };