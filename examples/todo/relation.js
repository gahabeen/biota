require("dotenv").config({});
const { Biota, Page } = require("../../dist");

(async () => {
  const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

  // let todos = await db
  //   .relation("todos_relation")
  //   .many("todos")
  //   .connects.on("user");

  // relations
  // db.relation("todos_ownership")
  //   .many("todos", "activity.owner")
  //   .connects.one("users");

  // db.relation("todos_ownership")
  //   .many("todos", "activity.owner")
  //   .connects.one("users");

  console.log(
    await db
      .relation("todos_relation")
      .many("todos", "activity.owner")
      .connects.many("users")
  );
})();
