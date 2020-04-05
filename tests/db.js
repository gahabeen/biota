const fauna = require("faunadb");
const q = fauna.query;
const path = require("path");
const { nanohash } = require("nanohash");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { Biota, factory } = require("./../dist/index");

async function database() {
  const c = new Biota({ secret: process.env.FAUNA_TEST });
  const nshash = nanohash({ size: 9 });
  const id = nshash.generate();
  const { secret } = await c.query(
    q.Let(
      {
        database: q.CreateDatabase({
          name: id,
        }),
      },
      q.CreateKey({
        database: q.Select("ref", q.Var("database")),
        role: "admin",
      })
    )
  );
  return {
    db: new Biota({ secret }),
    drop() {
      return c.query(q.Delete(q.Database(id)));
    },
  };
}

(async () => {
  const db = await database();
  let response = await db.query(factory.fql.base.insert.collection("users"));
  console.log(response);
})();
