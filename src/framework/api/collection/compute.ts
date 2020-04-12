import { BiotaFrameworkCollectionFieldOptions, BiotaFrameworkIndexOptions } from '~/../types/framework/framework.collection';
import { Biota } from '~/biota';
import { role as roleFactory } from '~/factory/api/classes';
import { execute } from '~/tasks';
import { delay } from '~/helpers/delay';

export function compute(this: Biota, collectionName: string) {
  const self = this;

  return async function computeMethod(field: BiotaFrameworkCollectionFieldOptions, options: BiotaFrameworkIndexOptions = {}) {
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
                  domain: 'Biota.collection.compute',
                });
              }
            }
            return indexes;
          });
      },
    });

    return execute(tasks, {
      domain: 'Biota.collection.compute',
    });
  };
}
