require("dotenv").config({});
const { Biota } = require("../../dist");

(async () => {
  const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

  await db.foundation();

  await db.collection("users").searchable("name");

  await db.collection("todos").scaffold();
  // relations
  // db.relation("todos_ownership")
  //   .many("todos", "activity.owner")
  //   .connects.one("users");

  // db.relation("todos_ownership")
  //   .many("todos", "activity.owner")
  //   .connects.one("users");

  // search
  await db.collection("todos").searchable("name");
  await db.collection("todos").autocomplete("name");
  await db.collection("todos").searchable("done");
  await db.collection("todos").searchable("ongoing");
})();
