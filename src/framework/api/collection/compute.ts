import { FrameworkCollectionFieldOptions, FrameworkIndexOptions } from '~/types/framework/framework.collection';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { delay } from '~/helpers/delay';

export function compute(this: Biota, collectionName: string) {
  const self = this;

  return async function computeMethod(field: FrameworkCollectionFieldOptions, options: FrameworkIndexOptions = {}) {
    const { role, roles } = options;
    let roleList = role || roles;
    if (!Array.isArray(roleList)) roleList = [role as string];
    const tasks = [];

    tasks.push({
      name: `Scaffolding index field on ${collectionName}`,
      async task() {
        return self
          .collection(collectionName)
          .field({ ...field, action: 'compute' })
          .then(async (indexes: any) => {
            for (const index of indexes) {
              const { ref, name } = index || {};
              if (name && role) {
                const subTasks = [];
                for (const r of roleList) {
                  subTasks.push({
                    name: `Adding privilege (read) for index ${name} on ${r}`,
                    async task() {
                      await delay(300);
                      return self.query(
                        self.role(r).privilege.set({
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
