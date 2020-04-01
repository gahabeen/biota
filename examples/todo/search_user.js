require("dotenv").config({});
const { Biota, Page } = require("../../dist");

(async () => {
  const db = new Biota({ secret: process.env.FAUNA_DB_SECRET, debug: true });

  let todos = await db.collection("todos").find({
    name: {
      $ngram: "implement"
    }
  });

  // console.log(JSON.stringify(todos, null, 2));

  // try {
  //   let results = await Page(todos);
  //   console.log(JSON.stringify(results, null, 2));
  // } catch (error) {
  //   console.error(error);
  // }
})().catch(err => console.error(JSON.stringify(err)));
