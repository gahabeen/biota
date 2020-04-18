import { FrameworkCollectionFieldOptions, FrameworkIndexOptions } from '~/types/framework/framework.collection';
import { Biota } from '~/biota';
import { delay } from '~/helpers/delay';
import { execute } from '~/tools/tasks';

export function index(this: Biota, collectionName: string) {
  const self = this;

  return async function indexMethod(field: string | FrameworkCollectionFieldOptions, options: FrameworkIndexOptions = {}) {
    const { role, roles, maxLength } = options;
    let roleList = role || roles;
    if (!Array.isArray(roleList)) roleList = [role as string];
    const tasks = [];

    const definition: FrameworkCollectionFieldOptions = {
      field: null,
      action: 'index',
      ngram: false,
      ngramMax: maxLength,
    };

    if (typeof field === 'string') {
      definition.field = field;
    } else if (typeof field === 'object') {
      Object.assign(definition, field);
    }

    tasks.push({
      name: `Adding index field ${definition.field} on ${collectionName}`,
      async task() {
        return self
          .collection(collectionName)
          .field(definition)
          .then(async (indexes: any) => {
            for (const indexItem of indexes) {
              const { ref, name } = indexItem || {};
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
                    fullError: true,
                  });
                }
                await execute(subTasks, {
                  domain: 'Biota.collection.index',
                });
              }
            }
            return indexes;
          });
      },
    });

    return execute(tasks, {
      domain: 'Biota.collection.index',
    });
  };
}
