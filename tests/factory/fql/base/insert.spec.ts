import { wrapper } from "../../../wrapper";
import { factory } from "../../../client";

describe("factory.fql.base.insert.collection", () => {
  test(
    "should [insert] the [collection]",
    wrapper(async (db) => {
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
    })
  );
});

describe("factory.fql.base.insert.document", () => {
  test(
    "should [insert] the [document]",
    wrapper(async (db) => {
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
    })
  );
});
