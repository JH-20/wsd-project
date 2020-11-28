const get_report = async({response, render}) => {
  // TODO
  response.body = 'This is report'
  //render('index.ejs', { root: 'This is hello' });
};

const post_report = async({response, render}) => {
  // TODO
  console.log('Handle report POST')
};

const get_summary = async({response, render}) => {
  // TODO
  response.body = 'This is summary'
  //render('index.ejs', { root: 'This is hello' });
};
 
export { get_report, post_report, get_summary };