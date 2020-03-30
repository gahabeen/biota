require("dotenv").config({});
const { Biota } = require("../../dist");

(async () => {
  const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

  await db.collection("users").import(
    [
      {
        id: 1,
        data: {
          name: "Gabin"
        }
      },
      {
        id: 2,
        data: {
          name: "Charlotte"
        }
      }
    ],
    { keepId: true }
  );

  await db.collection("todos").import(
    [
      {
        id: 1,
        data: {
          name: "Go for a walk",
          done: true,
          access: {
            owner: 1
          }
        }
      },
      {
        id: 2,
        data: {
          name: "Implement a framework around Fauna",
          ongoing: true,
          done: false,
          access: {
            owner: 1
          }
        }
      },
      {
        id: 3,
        data: {
          name: "Test the automatic scaffolding",
          ongoing: true,
          access: {
            owner: 2,
            asssignees: [1]
          }
        }
      },
      {
        id: 4,
        data: {
          name: "Do nothing",
          ongoing: false,
          done: false,
          access: {
            owner: 2
          }
        }
      }
    ],
    { keepId: true }
  );
})();
