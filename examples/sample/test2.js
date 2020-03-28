require("dotenv").config({});
const { Biota, q } = require("../../dist");

const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

(async () => {
  const dbAsUser = await db.login("261237277779296770", "test");

  await dbAsUser
    // .query(q.Call("Test"))
    // .query(q.Paginate(q.Documents(q.Collection("users"))))
    // .query(
    //   q.Paginate(
    //     q.Match(q.Index("biota.users__searchable__by__profile.name"), "Gabin")
    //   )
    // )
    // .query(q.Call("biota.FindIndex", q.Collection("users"), ["term:data.profile.email"]))
    .query(q.Call("biota.Search", [q.Collection("users"), {"profile.email": "desserprit.gabin@gmail.com"}, {}]))
    .then(res => console.log(JSON.stringify(res, null, 2)))
    .catch(err => console.error(JSON.stringify(err, null, 2)));

  // console.log("results", results);
})();
