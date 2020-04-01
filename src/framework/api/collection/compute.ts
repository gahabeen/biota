// types
import { FaunaCollectionOptions, DBFrameworkCollectionIndexOptions, DBFrameworkCollectionFieldOptions } from "~/../types/db";
import { update } from "~/factory/api/update";
// biota
import { execute } from "~/tasks";
import { DB } from "~/db";

export function compute(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function computeMethod(field: DBFrameworkCollectionFieldOptions, options: DBFrameworkCollectionIndexOptions = {}) {
    let { role, roles } = options;
    let roleList = role || roles;
    if (!Array.isArray(roleList)) roleList = [role as string];
    let tasks = [];

    tasks.push({
      name: `Scaffolding index field on ${collectionDefinition.name}`,
      async task() {
        return self
          .collection(collectionDefinition.name)
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
                                history_read: true
                              }
                            }
                          ]
                        })
                      );
                    }
                  });
                }
                await execute(subTasks);
              }
            }
            return indexes;
          });
      }
    });

    return execute(tasks, {
      domain: "DB.collection.compute"
    });
  };
}
