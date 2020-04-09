import { Biota, factory, q } from "../src/index";
import { nanohash } from "nanohash";

export function client() {
  return new Biota({ secret: process.env.FAUNA_TEST });
}

export async function database() {
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

export { factory };
