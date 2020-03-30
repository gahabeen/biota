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
import { name } from "~/helpers";

export async function foundation(this: DB) {
  const self = this;
  let tasks = [];

  /**
   *  Roles (base)
   */

  if (false) {
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

  if (false) {
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
    if (false) {
      tasks.push({
        name: `Scaffold collection: ${defaultCollections.users.name}`,
        task() {
          return self.collection(defaultCollections.users).scaffold();
        }
      });
    }

    if (false) {
      tasks.push({
        name: `Scaffold collection: ${defaultCollections.actions.name}`,
        task() {
          return self
            .collection(defaultCollections.actions)
            .scaffold({ searchable: ["document", "ts", "user", "name"] });
        }
      });
    }

    if (true) {
      tasks.push({
        name: `Scaffold collection: ${defaultCollections.relations.name}`,
        task() {
          return self.collection(defaultCollections.relations).scaffold({
            searchable: [
              "name",
              "parts.relation",
              "parts.collection",
              "parts.path"
            ],
            fields: [
              {
                field: "uniqueness_check",
                unique: true,
                values: [
                  {
                    field: ["data", "parts", "0", "relation"]
                  },
                  {
                    field: ["data", "parts", "0", "collection"]
                  },
                  {
                    field: ["data", "parts", "0", "path"]
                  },
                  {
                    field: ["data", "parts", "1", "relation"]
                  },
                  {
                    field: ["data", "parts", "1", "collection"]
                  },
                  {
                    field: ["data", "parts", "1", "path"]
                  }
                ]
              }
            ]
          });
        },
        fullError: true
      });
    }
  }

  /**
   *  Indexes
   */

  if (false) {
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

  if (false) {
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
