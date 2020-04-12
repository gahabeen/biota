import { BiotaFrameworkCollectionFieldOptions, BiotaFrameworkIndexOptions } from '~/../types/framework/framework.collection';
import { Biota } from '~/biota';
import { role as roleFactory } from '~/factory/api/classes';
import { execute } from '~/tasks';
import { q } from '~/index';
import { delay } from '~/helpers/delay';

export function index(this: Biota, collectionName: string) {
  const self = this;

  return async function indexMethod(field: string | BiotaFrameworkCollectionFieldOptions, options: BiotaFrameworkIndexOptions = {}) {
    let { role, roles, maxLength } = options;
    let roleList = role || roles;
    if (!Array.isArray(roleList)) roleList = [role as string];
    let tasks = [];

    let definition: BiotaFrameworkCollectionFieldOptions = {
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
