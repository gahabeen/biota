const fauna = require('faunadb')
const q = fauna.query
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { Biota, factory } = require("./../dist/index");

let db = new Biota({ secret: process.env.FAUNA_TEST });

(async () => {
  try {
    console.log({
      name: "users",
      ref: q.Collection("users"),
      history_days: 30,
    });
    // await db.query(factory.fql.base.clean.collection("users"));
    // let res = await db.query(factory.fql.base.insert.collection("users"));
    // console.log(res);
  } catch (error) {
    console.error(error);
  }
})();
