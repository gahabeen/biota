import { DBFrameworkCollectionFieldOptions, DBFrameworkIndexOptions } from '~/../types/framework/framework.collection';
import { DB } from '~/db';
import { role as roleFactory } from '~/factory/api/classes';
import { execute } from '~/tasks';
import { delay } from '~/helpers/delay';

export function compute(this: DB, collectionName: string) {
  const self = this;

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
          .field({ ...field, action: 'compute' })
          .then(async (indexes: any) => {
            for (let index of indexes) {
              let { ref, name } = index || {};
              if (name && role) {
                let subTasks = [];
                for (let r of roleList) {
                  subTasks.push({
                    name: `Adding privilege (read) for index ${name} on ${r}`,
                    async task() {
                      await delay(300);
                      return self.query(
                        self.role(r).privilege.upsert({
                          resource: ref,
                          actions: {
                            read: true,
                            history_read: true,
                          },
                        }),
                      );
                    },
                  });
                }
                await execute(subTasks, {
                  domain: 'DB.collection.compute',
                });
              }
            }
            return indexes;
          });
      },
    });

    return execute(tasks, {
      domain: 'DB.collection.compute',
    });
  };
}
