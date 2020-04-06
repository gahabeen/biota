import { FaunaCollectionOptions } from "~/../types/fauna";
import { DBFrameworkCollectionFieldOptions, DBFrameworkIndexOptions } from "~/../types/framework/framework.collection";
import { DB } from "~/db";
import { update } from "~/factory/api/udf";
import { execute } from "~/tasks";

export function compute(this: DB, collectionName: string) {
  let self = this;

  return async function computeMethod(field: DBFrameworkCollectionFieldOptions, options: DBFrameworkIndexOptions = {}) {
    let { role, roles } = options;
    let roleList = role || roles;
    if (!Array.isArray(roleList)) roleList = [role as string];
    let tasks = [];

    tasks.push({
      name: `Scaffolding index field on ${collectionName}`,
      async task() {
        return self
          .collection(collectionName)
          .field({ ...field, action: "compute" })
          .then(async (indexes: any) => {
            for (let index of indexes) {
              let { ref, name } = index || {};
              if (name && role) {
                let subTasks = [];
                for (let r of roleList) {
                  subTasks.push({
                    name: `Adding privilege (read) for index ${name} on ${r}`,
                    task() {
                      return self.query(
                        update.role(r, {
                          privileges: [
                            {
                              resource: ref,
                              actions: {
                                read: true,
                                history_read: true,
                              },
                            },
                          ],
                        })
                      );
                    },
                  });
                }
                await execute(subTasks, {
                  domain: "DB.collection.compute",
                });
              }
            }
            return indexes;
          });
      },
    });

    return execute(tasks, {
      domain: "DB.collection.compute",
    });
  };
}
