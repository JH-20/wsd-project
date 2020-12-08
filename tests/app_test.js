import { assert } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../app.js"
import { get_login, get_registration, get_regsuccess } from "../routes/controllers/authController.js"
import { get_report, get_report_m, get_report_e } from "../routes/controllers/behaviorController.js"
import { authMiddleware } from "../middlewares/middlewares.js"

console.log('---- Running tests ----')

// STATUS CODE TESTS

Deno.test("GET request to / should return status 200", async () => {
  const testClient = await superoak(app);
  await testClient.get("/").expect(200);
});

Deno.test("GET request to /auth/login should return status 200", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/login").expect(200);
});

Deno.test("GET request to /auth/registration should return status 200", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/registration").expect(200);
});

Deno.test("GET request to /auth/regsuccess should return status 200", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/regsuccess").expect(200);
});

Deno.test("GET request to /api/summary should return status 200", async () => {
  const testClient = await superoak(app);
  await testClient.get("/api/summary").expect(200);
});

Deno.test("GET request to /api/summary/2020/12/1 should return status 200", async () => {
  const testClient = await superoak(app);
  await testClient.get("/api/summary/2020/12/1").expect(200);
});


// RENDER TESTS

var txt = ""

const myRender = (t) => {
  txt = t
}

Deno.test("get_login should render the correct ejs file", async () => {
  txt = ""
  get_login({ render: myRender })
  assert(txt === "login.ejs", `get_login should render login.ejs, was ${txt}`)
});

Deno.test("get_registration should render the correct ejs file", async () => {
  txt = ""
  get_registration({ render: myRender })
  assert(txt === "registration.ejs", `get_registration should render registration.ejs, was ${txt}`)
});

Deno.test("get_regsuccess should render the correct ejs file", async () => {
  txt = ""
  get_regsuccess({ render: myRender })
  assert(txt === "reg_success.ejs", `get_regsuccess should render reg_success.ejs, was ${txt}`)
});

Deno.test("get_report should render the correct ejs file", async () => {
  txt = ""
  get_report({ render: myRender })
  assert(txt === "report.ejs", `get_report should render report.ejs, was ${txt}`)
});

Deno.test("get_report_m should render the correct ejs file", async () => {
  txt = ""
  get_report_m({ render: myRender })
  assert(txt === "morning_r.ejs", `get_report_m should render morning_r.ejs, was ${txt}`)
});

Deno.test("get_report_e should render the correct ejs file", async () => {
  txt = ""
  get_report_e({ render: myRender })
  assert(txt === "evening_r.ejs", `get_report_e should render evening_r.ejs, was ${txt}`)
});


// ACCESS TESTS

Deno.test("authMiddleware should not prevent unauthenticated access to URL starting with /api", async () => {
  var allowedAccess = false
  const myNext = () => {
    allowedAccess = true
  }
  var redirectURL = ""
  var myContext = {
    request: {
      url: {
        pathname: "/api/summary"
      }
    },
    response: {
      redirect: (p) => { redirectURL = p }
    },
    session: {
      get: () => { return false } // Unauthenticated
    }
  }
  await authMiddleware(myContext, myNext)
  assert(allowedAccess === true, `authMiddleware should not prevent access to /api/summary`)
});

Deno.test("authMiddleware should not prevent unauthenticated access to URL starting with /auth", async () => {
  var allowedAccess = false
  const myNext = () => {
    allowedAccess = true
  }
  var redirectURL = ""
  var myContext = {
    request: {
      url: {
        pathname: "/auth/login"
      }
    },
    response: {
      redirect: (p) => { redirectURL = p }
    },
    session: {
      get: () => { return false } // Unauthenticated
    }
  }
  await authMiddleware(myContext, myNext)
  assert(allowedAccess === true, `authMiddleware should not prevent access to /auth/login`)
});

Deno.test("authMiddleware should prevent unauthenticated access to '/', and redirect to '/auth/login'", async () => {
  var allowedAccess = false
  const myNext = () => {
    allowedAccess = true
  }
  var redirectURL = ""
  var myContext = {
    request: {
      url: {
        pathname: "/"
      }
    },
    response: {
      redirect: (p) => { redirectURL = p }
    },
    session: {
      get: () => { return false } // Unauthenticated
    }
  }
  await authMiddleware(myContext, myNext)
  assert(allowedAccess === false, `authMiddleware should prevent access to '/'`)
  assert(redirectURL === '/auth/login', `authMiddleware should redirect to '/auth/login'`)
});

Deno.test("authMiddleware should allow authenticated access to '/'", async () => {
  var allowedAccess = false
  const myNext = () => {
    allowedAccess = true
  }
  var redirectURL = ""
  var myContext = {
    request: {
      url: {
        pathname: "/"
      }
    },
    response: {
      redirect: (p) => { redirectURL = p }
    },
    session: {
      get: () => { return true } // Authenticated
    }
  }
  await authMiddleware(myContext, myNext)
  assert(allowedAccess === true, `authMiddleware should not prevent access to '/'`)
});