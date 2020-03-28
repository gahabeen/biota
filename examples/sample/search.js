require("dotenv").config({});
const { Biota, q } = require("../../dist");

const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

(async () => {
  const dbAsUser = await db.login("261237277779296770", "test");

  await dbAsUser
    .collection("users")
    .search({
      "profile.email": "desserprit.gabin@gmail.com",
      "profile.name": "Gabin"
    })
    .then(res => console.log(JSON.stringify(res, null, 2)))
    .catch(err => console.error(JSON.stringify(err, null, 2)));
})();
