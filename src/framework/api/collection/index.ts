import { DBFrameworkCollectionFieldOptions, DBFrameworkIndexOptions } from "~/../types/framework/framework.collection";
import { DB } from "~/db";
import { role as roleFactory } from "~/factory/api/classes";
import { execute } from "~/tasks";
import { q } from "~/index";

export function index(this: DB, collectionName: string) {
  let self = this;

  return async function indexMethod(field: string | DBFrameworkCollectionFieldOptions, options: DBFrameworkIndexOptions = {}) {
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
      name: `Adding index field ${definition.field} on ${collectionName}`,
      async task() {
        return self
          .collection(collectionName)
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
                        roleFactory.privilege.upsert(r, {
                          resource: ref,
                          actions: {
                            read: true,
                            history_read: true,
                          },
                        })
                      );
                    },
                    fullError: true,
                  });
                }
                await execute(subTasks, {
                  domain: "DB.collection.index",
                });
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
