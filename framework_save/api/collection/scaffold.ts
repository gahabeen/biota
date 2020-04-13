import { FaunaCollectionOptions } from '~/../types/fauna';
import { BiotaFrameworkCollectionScaffoldOptions } from '~/../types/framework/framework.collection';
import { Biota } from '~/biota';
import { query as q } from 'faunadb';
import { upsert } from '~/factory/api/fql/base';
import { BiotaRoleName, Privilege } from '~/factory/constructors/role';
import { execute } from '~/tasks';

export function scaffold(this: Biota, collectionName: string) {
  const self = this;

  return async function scaffoldMethod(collectionOptions: FaunaCollectionOptions, options: BiotaFrameworkCollectionScaffoldOptions = {}) {
    let defaultRoles = options.roles || ['biota.user'];
    let defaultSearchable = [
      '~ref',
      '~ts',
      '_auth.providers.provider',
      '_auth.providers.id',
      '_membership.owner',
      '_membership.roles',
      '_membership.owner',
      '_membership.assignees',
      '_activity.assigned_by',
      // "_activity.assigned_at",
      '_activity.owner_changed_by',
      // "_activity.owner_changed_at",
      '_activity.credentials_changed_by',
      // "_activity.credentials_changed_at",
      '_activity.created_by',
      // "_activity.created_at",
      '_activity.updated_by',
      // "_activity.updated_at",
      '_activity.replaced_by',
      // "_activity.replaced_at",
      '_activity.expired_by',
      // "_activity.expired_at",
      '_activity.deleted_by',
      // "_activity.deleted_at",
      '_activity.archived_by',
      // "_activity.archived_at",
      '_activity.hidden_by',
      // "_activity.hidden_at"
    ];

    let { index = defaultSearchable, compute = [], field = [] } = options || {};

    let tasks = [
      {
        name: `Upserting collection (${collectionName})`,
        async task() {
          return self.query(upsert.collection.call(self, collectionName, collectionOptions));
        },
      },
    ];

    for (let indexField of index) {
      tasks.push({
        name: `Upserting index field (${indexField}) on (${collectionName})`,
        async task() {
          return self.collection(collectionName).index(indexField, { role: BiotaRoleName('user') });
        },
      });
    }

    for (let computeField of compute) {
      tasks.push({
        name: `Upserting viewable field (${computeField.field}) on (${collectionName})`,
        async task() {
          return self.collection(collectionName).compute(computeField, { role: BiotaRoleName('user') });
        },
      });
    }

    for (let fieldField of field) {
      tasks.push({
        name: `Upserting viewable field (${fieldField.field}) on (${collectionName})`,
        async task() {
          return self.collection(collectionName).field(fieldField);
        },
      });
    }

    for (let role of defaultRoles) {
      tasks.push({
        name: `Adding collection ${collectionName} to [${role}] role`,
        async task() {
          return self.role(role).privilege.repsert(
            Privilege({
              resource: q.Collection(collectionName),
              actions: {
                create: 'all',
                read: ['self', 'owner', 'assignee'],
                write: ['self', 'owner', 'assignee'],
                delete: 'owner',
              },
            }),
          );
          // .then(res => console.log(JSON.stringify(res.privileges[0], null, 2)))
        },
      });
    }

    tasks.push({
      name: `Adding collection ${collectionName} to [system] role`,
      async task() {
        return self.role(BiotaRoleName('system')).privilege.upsert(
          Privilege({
            resource: q.Collection(collectionName),
            actions: {
              create: 'all',
              read: 'all',
              history_read: 'all',
              history_write: 'all',
              write: 'all',
              delete: 'all',
            },
          }),
        );
      },
    });

    return execute(tasks, {
      domain: 'Biota.collection.scaffold',
    });
  };
}
