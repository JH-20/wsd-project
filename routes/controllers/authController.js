import { executeQuery } from '../../database/database.js'
import { bcrypt } from '../../deps.js'
import { validate, required, isEmail, minLength } from '../../deps.js'

const get_login = async({render}) => {
  render('login.ejs')
};

const post_login = async({request, response, render, session}) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get('email');
  const password = params.get('password');

  // check if the email exists in the database
  const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
  if (res.rowCount === 0) {
    render('/login.ejs', {error: "Invalid email or password"})
    return;
  }

  // take the first row from the results
  const userObj = res.rowsOfObjects()[0];

  const hash = userObj.password;

  const passwordCorrect = await bcrypt.compare(password, hash);
  if (!passwordCorrect) {
    render('/login.ejs', {error: "Invalid email or password"})
    return;
  }

  await session.set('authenticated', true);
  await session.set('user', {
    id: userObj.id,
    email: userObj.email
  });
  await session.set('msg', 'Login successful')
  response.redirect('/')
};

const post_logout = async({response, session}) => {
  await session.set('authenticated', false);
  await session.set('user', undefined);
  response.redirect('/auth/login')
};

const get_registration = async({render}) => {
  render('registration.ejs');
};

const post_registration = async({request, response, render}) => {
  const body = request.body();
  const params = await body.value;
  
  const data = {}
  data.email = params.get('email');
  data.password = params.get('password');
  data.verification = params.get('verification');

  // Validate
  const validationRules = {
    email: [required, isEmail],
    password: [required, minLength(4)],
    verification: [required]
  }

  var [passes, errors] = await validate(data, validationRules)
  
  if (data.password !== data.verification) {
    passes = false
    errors.verification = errors.verification ? errors.verification : {}
    errors.verification.match = 'The entered passwords did not match';
  }

  const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", data.email);
  if (existingUsers.rowCount > 0) {
    passes = false
    errors.email = errors.email ? errors.email : {}
    errors.email.exists = 'The email is already in use';
  }

  console.log(passes)
  console.log(errors)

  if (!passes) {
    render('registration.ejs', {email: data.email, errors: errors});
    return
  }

  const hash = await bcrypt.hash(data.password);
  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", data.email, hash);
  response.redirect('/auth/regsuccess')
};

const get_regsuccess = async({render}) => {
  render('reg_success.ejs');
};
 
export { get_login, post_login, post_logout, get_registration, post_registration, get_regsuccess };