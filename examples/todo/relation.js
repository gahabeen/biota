require("dotenv").config({});
const { Biota, Page } = require("../../dist");

(async () => {
  const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

  // let todos = await db
  //   .relation("todos_relation")
  //   .many("todos")
  //   .connects.on("user");

  console.log(
    db
      .relation("todos_relation")
      .many("todos", "activity.owner")
      .connects.many("users")
  );
})();
