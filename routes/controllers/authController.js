const get_login = async({response}) => {
  // TODO
  response.body = 'This is login'
  //render('index.ejs', { root: 'This is hello' });
};

const post_login = async({response}) => {
  // TODO
  console.log('Handle login POST')
};

const post_logout = async({response}) => {
  // TODO
  console.log('Handle logout POST')
};

const get_registration = async({response}) => {
  // TODO
  response.body = 'This is registration'
  //render('index.ejs', { root: 'This is hello' });
};

const post_registration = async({response}) => {
  // TODO
  console.log('Handle registration POST')
};
 
export { get_login, post_login, post_logout, get_registration, post_registration };