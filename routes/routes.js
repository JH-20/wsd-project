import { Router } from "../deps.js";
import { get_root } from "./controllers/rootController.js";
import * as behaviorC from "./controllers/behaviorController.js";
import * as authC from "./controllers/authController.js";
import * as summaryApi from "./apis/summaryApi.js";

const router = new Router();

router.get('/', get_root)

router.get('/behavior/reporting', behaviorC.get_report)

router.get('/behavior/reporting/morning', behaviorC.get_report_m)
router.post('/behavior/reporting/morning', behaviorC.post_report_m)
router.get('/behavior/reporting/evening', behaviorC.get_report_e)
router.post('/behavior/reporting/evening', behaviorC.post_report_e)

router.get('/behavior/summary', behaviorC.get_summary)

router.get('/behavior/summary/weekly', behaviorC.get_summary_weekly)
router.post('/behavior/summary/weekly', behaviorC.post_summary_weekly)
router.get('/behavior/summary/monthly', behaviorC.get_summary_monthly)
router.post('/behavior/summary/monthly', behaviorC.post_summary_monthly)

router.get('/auth/login', authC.get_login)
router.post('/auth/login', authC.post_login)

router.post('/auth/logout', authC.post_logout)

router.get('/auth/registration', authC.get_registration)
router.post('/auth/registration', authC.post_registration)
router.get('/auth/regsuccess', authC.get_regsuccess)

router.get('/api/summary', summaryApi.summary);
router.get('/api/summary/:year/:month/:day', summaryApi.day_summary);

export { router };