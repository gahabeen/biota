require("dotenv").config({});
const { Biota, q } = require("../../dist");

const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

(async () => {
  await db
    // .query(q.Paginate(q.Collections()))
    .query(
      db.factory.update.role({
        name: "user",
        membership: {
          resource: q.Collection("users")
        },
        privileges: [
          {
            resource: q.Collection("users"),
            actions: { read: true }
          }
        ]
      })
    )
    .then(res => console.log(JSON.stringify(res, null, 2)))
    .catch(err => console.error(JSON.stringify(err, null, 2)));

  // console.log("results", results);
})();
