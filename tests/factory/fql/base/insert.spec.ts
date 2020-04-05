import { database, factory } from "../../../client";

describe("factory.fql.base.insert.collection", () => {
  test("should [insert] the [collection]", async (done) => {
    const { db, drop } = await database();
    try {
      // ---
      let response = await db.query(factory.fql.base.insert.collection("users"));
      expect(response).toMatchObject({
        name: "users",
        ref: {
          collection: {
            id: "collections",
          },
          id: "users",
        },
        ts: expect.any(Number),
        history_days: 30,
      });
      // ---
    } catch (error) {
      done(error);
    } finally {
      await drop();
      done();
    }
  });
});

describe("factory.fql.base.insert.document", () => {
  test("should [insert] the [document]", async (done) => {
    const { db, drop } = await database();
    try {
      // ---
      await db.query(factory.fql.base.insert.collection("users"));
      let response = await db.query(factory.fql.base.insert.document("users", { data: { test: true } }, "123"));
      expect(response).toMatchObject({
        ref: {
          collection: {
            id: "users",
          },
          id: "123",
        },
        data: {
          test: true,
        },
        ts: expect.any(Number),
      });
      // ---
    } catch (error) {
      done(error);
    } finally {
      await drop();
      done();
    }
  });
});
