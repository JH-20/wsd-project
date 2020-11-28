let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = 'postgres://jsdedmej:tpGMpAAawsun1iAB8wMh_16wXEfy2O3m@hattie.db.elephantsql.com:5432/jsdedmej'
}

export { config };