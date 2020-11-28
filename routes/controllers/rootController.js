const get_root = async({response, render}) => {
  // TODO
  response.body = 'This is root'
  //render('index.ejs', { root: 'This is hello' });
};
 
export { get_root };