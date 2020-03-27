require("dotenv").config({});
const { Biota } = require("../../dist");

const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });
// const { q } = db;

(async () => {
  await db.foundation();
  // .then(res => console.log(JSON.stringify(res, null, 2)))
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
})();
