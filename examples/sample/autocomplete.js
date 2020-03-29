require("dotenv").config({});
const { Biota, q } = require("../../dist");

const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

(async () => {
  await db
    .collection("users")
    .autocomplete("profile.name")
    .then(res => console.log(JSON.stringify(res, null, 2)))
    // .catch(err => console.error(JSON.stringify(err, null, 2)));
})();
