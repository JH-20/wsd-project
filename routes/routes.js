import { Router } from "../deps.js";
import { get_root } from "./controllers/rootController.js";
import * as behaviourC from "./controllers/behaviourController.js";
import * as authC from "./controllers/authController.js";
import * as summaryApi from "./apis/summaryApi.js";

const router = new Router();

router.get('/', get_root)

router.get('/behavior/reporting', behaviourC.get_report)
router.post('/behavior/reporting', behaviourC.post_report)

router.get('/behavior/summary', behaviourC.get_summary)

router.get('/auth/login', authC.get_login)
router.post('/auth/login', authC.post_login)

router.post('/auth/logout', authC.post_logout)

router.get('/auth/registration', authC.get_registration)
router.post('/auth/registration', authC.post_registration)

router.get('/api/summary', summaryApi.summary);
router.get('/api/summary/:year/:month/:day', summaryApi.day_summary);

export { router };