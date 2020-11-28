import { executeQuery } from "../database/database.js";

const getSummary = async() => {
  // TODO
  console.log('Create day summary')

  // const res = await executeQuery("SELECT message FROM messages ORDER BY id DESC LIMIT 1");
  // if (res && res.rowCount > 0) {
  //   return res.rowsOfObjects()[0].message;
  // }

  // return 'No messages available';
}

const getDaySummary = async(day, month, year) => {
  // TODO
  console.log('Create day summary')
}

export { getSummary, getDaySummary };