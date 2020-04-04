import { FaunaCollectionOptions } from "~/../types/fauna";
import { DBFrameworkCollectionFieldOptions, DBFrameworkCollectionIndexOptions } from "~/../types/framework/framework.collection";
import { DB } from "~/db";
import { update } from "~/factory/api/udf";
import { execute } from "~/tasks";

export function index(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function indexMethod(field: string | DBFrameworkCollectionFieldOptions, options: DBFrameworkCollectionIndexOptions = {}) {
    let { role, roles, maxLength } = options;
    let roleList = role || roles;
    if (!Array.isArray(roleList)) roleList = [role as string];
    let tasks = [];

    let definition: DBFrameworkCollectionFieldOptions = {
      field: null,
      action: "index",
      ngram: false,
      ngramMax: maxLength,
    };

    if (typeof field === "string") {
      definition.field = field;
    } else if (typeof field === "object") {
      Object.assign(definition, field);
    }

    tasks.push({
      name: `Adding index field ${definition.field} on ${collectionDefinition.name}`,
      async task() {
        return self
          .collection(collectionDefinition.name)
          .field(definition)
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
                    fullError: true,
                  });
                }
                await execute(subTasks);
              }
            }
            return indexes;
          });
      },
    });

    return execute(tasks, {
      domain: "DB.collection.index",
    });
  };
}
