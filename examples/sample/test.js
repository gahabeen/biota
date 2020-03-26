require("dotenv").config({});
const { Biota } = require("../../dist");

const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });
// const { q } = db;

(async () => {
  const users = await db.collection("users").scaffold();
  console.log("users", users);
  const profileName = await db.collection("users").searchable("profile.name");
  console.log("profileName", profileName);

  // await db.foundation();
})();
