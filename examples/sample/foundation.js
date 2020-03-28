require("dotenv").config({});
const { Biota } = require("../../dist");

(async () => {
  const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });
  await db.foundation();
  // .then(res => console.log(JSON.stringify(res, null, 2)))
  // .catch(err => console.error(JSON.stringify(err, null, 2)));
})();
