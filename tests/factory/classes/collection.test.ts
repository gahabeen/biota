import { query as q } from "faunadb";
import { client, factory } from "../../client";

const db = client();

describe("factory.collection.insert", () => {
  test("should add the collection", async () => {
    try {
      let res = await db.query(factory.collection.insert("users"));
      expect(res).toBe({});
    } catch (error) {
      console.error(error);
    }
  });
});

// describe('factory.collection.get', () => {
//   test('should return the collection', async () => {
//     await db
//       .query(factory.ca)
//       .then(console.log)
//       .catch(console.error)

//     // expect(collections.data)
//   })
// })
