import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { PrivilegeRights } from '~/factory/constructors/privilege';
// import { upsert } from '~/factory/api/fql/base';
import { BiotaRoleName } from '~/factory/constructors/role';
import { execute } from '~/tools/tasks';
import { FaunaCollectionOptions } from '~/types/fauna';
import { FrameworkCollectionScaffoldOptions } from '~/types/framework/framework.collection';
// import { upsert } from '~/factory/api/fql/base';

export function scaffold(this: Biota, collectionName: string) {
  const self = this;

  return async function scaffoldMethod(collectionOptions: FaunaCollectionOptions, options: FrameworkCollectionScaffoldOptions = {}) {
    const defaultRoles = options.roles || ['biota.user'];
    const defaultSearchable = [];

    const { index = defaultSearchable, compute = [], field = [] } = options || {};

    const tasks = [
      {
        name: `Upserting collection (${collectionName})`,
        async task() {
          return self.query(collection(self.context)(collectionName).upsert(collectionOptions));
        },
      },
    ];

    for (const indexField of index) {
      tasks.push({
        name: `Upserting index field (${indexField}) on (${collectionName})`,
        async task() {
          return self.collection(collectionName).index(indexField, { role: BiotaRoleName('user') });
        },
      });
    }

    for (const computeField of compute) {
      tasks.push({
        name: `Upserting viewable field (${computeField.field}) on (${collectionName})`,
        async task() {
          return self.collection(collectionName).compute(computeField, { role: BiotaRoleName('user') });
        },
      });
    }

    for (const fieldField of field) {
      tasks.push({
        name: `Upserting viewable field (${fieldField.field}) on (${collectionName})`,
        async task() {
          return self.collection(collectionName).field(fieldField);
        },
      });
    }

    for (const role of defaultRoles) {
      tasks.push({
        name: `Adding collection ${collectionName} to [${role}] role`,
        async task() {
          return self.role(role).privilege.set(
            PrivilegeRights({
              resource: q.Collection(collectionName),
              rights: {
                insert: true,
                get: ['self', 'owner', 'assignee'],
                update: ['self', 'owner', 'assignee'],
                replace: ['self', 'owner', 'assignee'],
                delete: ['owner'],
              },
            }),
          );
        },
      });
    }

    // tasks.push({
    //   name: `Adding collection ${collectionName} to [system] role`,
    //   async task() {
    //     return self.role(BiotaRoleName('system')).privilege.set(
    //       PrivilegeRights({
    //         resource: q.Collection(collectionName),
    //         actions: {
    //           create: 'all',
    //           read: 'all',
    //           history_read: 'all',
    //           history_write: 'all',
    //           write: 'all',
    //           delete: 'all',
    //         },
    //       }),
    //     );
    //   },
    // });

    return execute(tasks, {
      domain: 'Biota.collection.scaffold',
    });
  };
}
