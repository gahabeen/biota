import { database, factory } from "../../../client";

describe("factory.fql.base.insert.collection", () => {
  test("should insert the collection", async (done) => {
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
