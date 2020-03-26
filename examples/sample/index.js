const { Biota } = require("../../dist");

const db = new Biota({ secret: "" });
const { q } = db;

await db.foundation();

await db.collection("todos").scaffold();

// generate an index per field and do union/intersect for complex search!
await db.collection("todos").searchable("~/ref");
await db.collection("todos").searchable("~/ts");
await db.collection("todos").searchable("name");
await db.collection("todos").searchable({ field: "description", autocomplete: true });

await db.collection("todos").field({
  field: "definition.colours",
  binding: q.Query(q.Lambda())
});

// limit access to fields based on Roles
db.collection("users").protect(["roles"], "admin");

const todosIterator = db
  .collection("todos")
  .search({})
  .iterate({ size: 200 });

for await (let todosPage of todosIterator) {
  console.log(todosPage);
}

// Ex: Ownership
db.relation("todos_ownership")
  .many("todo")
  .at("activity.owner")
  .connects.one("user");

await db
  .relation("todos_owner")
  .disconnect.one("user", "123")
  .from.one("todo", "123");

// Ex: Assignements
await db
  .relation("todos_assignees")
  .many("todos")
  .connects.many("users");

await db
  .relation("todos_assignees")
  .disconnect.one("user", "123")
  .from.one("todo", "123");

// One-to-One
await db
  .relation("user_todo")
  .one("todo")
  .at("activity.owner")
  .connects.one("user");
// todo:activity.owner = userRef
/** INDEX
 * terms: todos:activity.owner + todos:ref UNIQUE
 * values: todos:ref
 */
await db
  .relation("user_todo")
  .connect.one("user", "123")
  .with.one("todo", "123");

await db.relation("user_has_one_todo").disconnect.one("todo", "123");
await db
  .relation("user_has_one_todo")
  .disconnect.all("todos")
  .from("user", "123");

// 1-to-Many
await db
  .relation("user_todos")
  .one("user")
  .connects.many("todos")
  .at("activity.owner");
// todo.activity.owner = userRef
/** INDEX
 * terms: todos:activity.owner
 * values: todos:ref
 */

// Many-to-Many
await db
  .relation("users_todos")
  .many("users")
  .connects.many("todos");

await db.import("todo", []);
