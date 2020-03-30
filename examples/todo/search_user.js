require("dotenv").config({});
const { Biota, Page } = require("../../dist");

(async () => {
  const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

  let todos = await db.collection("todos").search({
    name: {
      $ngram: "implement"
    }
  });
  try {
    let results = await Page(todos);
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error(error);
  }
})().catch(console.error)
