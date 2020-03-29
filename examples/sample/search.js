require("dotenv").config({});
const { Biota, q, Page } = require("../../dist");

const db = new Biota({ secret: process.env.FAUNA_DB_SECRET });

(async () => {
  const dbAsUser = await db.login("261237277779296770", "test");

  // const users = await dbAsUser.collection("users").search({
  //   "profile.email": "desserprit.gabin@gmail.com",
  //   "profile.name": "Gabin"
  // });

  // console.log(users);

  // const users = dbAsUser.collection("users").paginate({
  //   "profile.email": "desserprit.gabin@gmail.com",
  //   "profile.name": {
  //     $ngram: "Gabin"
  //   }
  // });

  const print = x => console.log(JSON.stringify(x, null, 2))
  const users = dbAsUser.collection("users").paginate(
    {
      "profile.name": {
        $ngram: "Cha"
      }
    }
  );

  // const users = dbAsUser.collection("users").paginate(null, {size: 1});

  try {
    await Page(users).then(print);
    await Page(users).then(print);
  } catch (error) {
    console.error(error);
  }

  // await dbAsUser
  //   .collection("users")
  //   .search({
  //     "profile.email": "desserprit.gabin@gmail.com",
  //     "profile.name": "Gabin"
  //   })
  //   .then(res => console.log(JSON.stringify(res, null, 2)))
  //   .catch(err => console.error(JSON.stringify(err, null, 2)));
})();
