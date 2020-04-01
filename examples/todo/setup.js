require("dotenv").config({});
const { Biota } = require("../../dist");

(async () => {
  const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

  await db.foundation({ roles: false, functions: false, indexes: false });

  // await db.collection("users").index("name");

  // await db.collection("todos").scaffold();

  // await db.collection("todos").index("name");
  // await db.collection("todos").index({ field: "name", ngram: true });
  // await db.collection("todos").index("done");
  // await db.collection("todos").index("ongoing");
})();
