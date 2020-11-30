import { Router } from "../deps.js";
import { get_root } from "./controllers/rootController.js";
import * as behaviourC from "./controllers/behaviourController.js";
import * as authC from "./controllers/authController.js";
import * as summaryApi from "./apis/summaryApi.js";

const router = new Router();

router.get('/', get_root)

router.get('/behavior/reporting', behaviourC.get_report)

router.get('/behavior/reporting/morning', behaviourC.get_report_m)
router.post('/behavior/reporting/morning', behaviourC.post_report_m)
router.get('/behavior/reporting/evening', behaviourC.get_report_e)
router.post('/behavior/reporting/evening', behaviourC.post_report_e)

router.get('/behavior/summary', behaviourC.get_summary)

router.get('/behavior/summary/weekly', behaviourC.get_summary_weekly)
router.post('/behavior/summary/weekly', behaviourC.post_summary_weekly)
router.get('/behavior/summary/monthly', behaviourC.get_summary_monthly)
router.post('/behavior/summary/monthly', behaviourC.post_summary_monthly)

router.get('/auth/login', authC.get_login)
router.post('/auth/login', authC.post_login)

router.post('/auth/logout', authC.post_logout)

router.get('/auth/registration', authC.get_registration)
router.post('/auth/registration', authC.post_registration)

router.get('/api/summary', summaryApi.summary);
router.get('/api/summary/:year/:month/:day', summaryApi.day_summary);

export { router };