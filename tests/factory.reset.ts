import { client, factory } from "./client";

const db = client();

(async () => {
  console.log("Factory.reset - start");
  await db.query(factory.fql.base.clean.databases());
  await db.query(factory.fql.base.clean.collections());
  await db.query(factory.fql.base.clean.indexes());
  await db.query(factory.fql.base.clean.roles());
  await db.query(factory.fql.base.clean.keys());
  await db.query(factory.fql.base.clean.tokens());
  await db.query(factory.fql.base.clean.udfunctions());
  console.log("Factory.reset - done");
})().catch(console.error);
