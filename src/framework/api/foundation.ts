// types
import { DB } from "~/db";
// external
import { query as q } from "faunadb";
// biota
import { execute } from "~/tasks";
import { create } from "~/factory/api/create";
import { upsert } from "~/factory/api/upsert";
import { repsert } from "~/factory/api/repsert";
import * as defaultFunctions from "~/framework/api/default/functions";
import * as defaultRoles from "~/framework/api/default/roles";
import * as defaultCollections from "~/framework/api/default/collections";
import * as defaultIndexes from "~/framework/api/default/indexes";

export async function foundation(this: DB) {
  const self = this;
  let tasks = [];

  /**
   *  Roles (base)
   */

  if (true) {
    for (let defaultRole of Object.values(defaultRoles)) {
      tasks.push({
        name: `Creating (base) role: ${defaultRole.name}`,
        task() {
          return self.query(
            q.If(
              q.Exists(q.Role(defaultRole.name)),
              null,
              create.role(defaultRole.name)
            )
          );
        }
      });
    }
  }

  /**
   *  Functions
   */

  if (true) {
    for (let UDFunction of Object.values(defaultFunctions)) {
      tasks.push({
        name: `Upserting function: ${UDFunction.name}`,
        task() {
          return self.query(repsert.function(UDFunction));
        },
        fullError: true
      });
    }
  }

  /**
   *  Collections
   */

  if (true) {
    for (let defaultCollection of Object.values(defaultCollections)) {
      tasks.push({
        name: `Scaffold collection: ${defaultCollection.name}`,
        task() {
          return self.collection(defaultCollection).scaffold();
        }
      });
    }
  }

  /**
   *  Indexes
   */

  if (true) {
    for (let defaultIndex of Object.values(defaultIndexes)) {
      tasks.push({
        name: `Upserting index: ${defaultIndex.name}`,
        task() {
          return self.query(upsert.index(defaultIndex));
        }
      });
    }
  }

  /**
   *  Roles
   */

  if (true) {
    for (let defaultRole of Object.values(defaultRoles)) {
      tasks.push({
        name: `Upserting role: ${defaultRole.name}`,
        task() {
          return self.query(upsert.role(defaultRole));
        },
        fullError: true
      });
    }
  }

  return execute(tasks);
}
