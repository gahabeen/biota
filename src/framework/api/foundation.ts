import { DB } from "~/db";
import { query as q } from "faunadb";
import { execute } from "~/tasks";
import { insert } from "~/factory/api/fql/base/insert";
import { upsert } from "~/factory/api/fql/base/upsert";
import { repsert } from "~/factory/api/fql/base/repsert";
import * as defaultFunctions from "~/framework/api/default/functions";
import * as defaultRoles from "~/framework/api/default/roles";
import * as defaultCollections from "~/framework/api/default/collections";
import * as defaultIndexes from "~/framework/api/default/indexes";
import { DBFoundationOptions } from "~/../types/db";

export async function foundation(this: DB, options: DBFoundationOptions) {
  const self = this;
  options = { roles: true, udfunctions: true, collections: true, indexes: true, ...options };
  let tasks = [];

  /**
   *  Roles (base)
   */

  if (options.roles) {
    for (let defaultRole of Object.values(defaultRoles)) {
      tasks.push({
        name: `Creating (base) role: ${defaultRole.name}`,
        task() {
          return self.query(q.If(q.Exists(q.Role(defaultRole.name)), null, insert.role(defaultRole.name)));
        },
      });
    }
  }

  /**
   *  Functions
   */

  if (options.udfunctions) {
    for (let UDFunction of Object.values(defaultFunctions)) {
      tasks.push({
        name: `Upserting function: ${UDFunction.name}`,
        task() {
          return self.query(repsert.udfunction(UDFunction.name, UDFunction));
        },
        fullError: true,
      });
    }
  }

  /**
   *  Collections
   */

  if (options.collections) {
    tasks.push({
      name: `Scaffold collection: ${defaultCollections.user_sessions.name}`,
      task() {
        return self.collection(defaultCollections.user_sessions.name).scaffold(defaultCollections.user_sessions);
      },
    });

    tasks.push({
      name: `Scaffold collection: ${defaultCollections.actions.name}`,
      task() {
        return self.collection(defaultCollections.actions.name).scaffold(defaultCollections.actions, {
          index: [
            "document",
            "ts",
            "user",
            "name",
            {
              field: "collection",
              binding: q.Query(q.Lambda("doc", q.Select(["data", "document", "collection"], q.Var("doc"), null))),
            },
            {
              field: "at",
              binding: q.Query(
                q.Lambda(
                  "doc",
                  q.Let(
                    {
                      ts: q.Select("ts", q.Var("doc"), null),
                    },
                    q.If(q.IsTimestamp(q.Var("ts")), q.ToTime(q.Var("ts")), null)
                  )
                )
              ),
            },
          ],
        });
      },
    });

    tasks.push({
      name: `Scaffold collection: ${defaultCollections.users.name}`,
      task() {
        return self.collection(defaultCollections.users.name).scaffold(defaultCollections.users);
      },
    });

    tasks.push({
      name: `Scaffold collection: ${defaultCollections.relations.name}`,
      task() {
        return self.collection(defaultCollections.relations.name).scaffold(defaultCollections.relations, {
          // index: ["name", "parts.relation", "parts.collection", "parts.path"],
          // field: [
          //   {
          //     field: "uniqueness_check",
          //     unique: true,
          //     outputs: [
          //       {
          //         field: "data.parts.0.relation",
          //       },
          //       {
          //         field: "data.parts.0.collection",
          //       },
          //       {
          //         field: "data.parts.0.path",
          //       },
          //       {
          //         field: "data.parts.1.relation",
          //       },
          //       {
          //         field: "data.parts.1.collection",
          //       },
          //       {
          //         field: "data.parts.1.path",
          //       },
          //     ],
          //   },
          // ],
        });
      },
      fullError: true,
    });
  }

  /**
   *  Indexes
   */

  if (options.indexes) {
    for (let defaultIndex of Object.values(defaultIndexes)) {
      tasks.push({
        name: `Upserting index: ${defaultIndex.name}`,
        task() {
          return self.query(upsert.index(defaultIndex.name, defaultIndex));
        },
      });
    }
  }

  /**
   *  Roles
   */

  if (options.roles) {
    for (let defaultRole of Object.values(defaultRoles)) {
      tasks.push({
        name: `Upserting role: ${defaultRole.name}`,
        task() {
          return self.query(upsert.role(defaultRole.name, defaultRole));
        },
        fullError: true,
      });
    }
  }

  return execute(tasks, {
    domain: "DB.foundation",
  });
}
