require("dotenv").config({});
const { Biota, q } = require("../../dist");

const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });
// const { q } = db;

(async () => {
  await db.foundation();
  // .then(res => console.log(JSON.stringify(res, null, 2)));

  // await db.collection("users").searchable("profile.email");
  // .catch(err => console.error(JSON.stringify(err, null, 2)));

  // const users = await db.collection("users").scaffold();
  // console.log("users", users);
  // const profileName = await db.collection("users").searchable("profile.name");
  // console.log("profileName", profileName);
  // const imports = await db.collection("users").import([
  //   {
  //     profile: {
  //       name: "Gabin"
  //     }
  //   },
  //   {
  //     profile: {
  //       name: "Charlotte"
  //     }
  //   },
  //   {
  //     profile: {
  //       name: "Nakkat"
  //     }
  //   }
  // ]);
  // console.log("imports", imports);

  const dbAsUser = await db.login("261237277779296770", "test");

  // console.log(await dbAsUser.query(q.Identity()));

  // await dbAsUser.collection("users").search({
  //   "profile.email": "desserprit.gabin@gmail.com",
  //   "profile.name": "Gabin"
  // });
  await dbAsUser
    .collection("users")
    .search({
      "profile.email": "desserprit.gabin@gmail.com",
      "profile.name": "Gabin"
    })
    // .query(q.Get(q.Ref(q.Collection("users"), "261237277779296770")))
    // .query(q.Get(q.Call("biota.FindIndex", [q.Collection("users"), ["term:data.profile.email"]])))
    .then(res => console.log(JSON.stringify(res, null, 2)))
    .catch(err => console.error(JSON.stringify(err, null, 2)));

  // console.log("results", results);
})();
