import { FaunaCollectionOptions } from "~/../types/fauna";
import { DBFrameworkCollectionScaffoldOptions } from "~/../types/framework/framework.collection";
import { DB } from "~/db";
// import { upsert } from "~/factory/api/udf";
import { upsert } from "~/factory/api/fql/base";
import { roleNameNormalized } from "~/factory/classes/role";
import { execute } from "~/tasks";

export function scaffold(this: DB, collectionName: string) {
  let self = this;

  return async function scaffoldMethod(collectionOptions: FaunaCollectionOptions, options?: DBFrameworkCollectionScaffoldOptions) {
    let defaultSearchable = [
      "~ref",
      "~ts",
      "_auth.providers.provider",
      "_auth.providers.id",
      "_access.owner",
      "_access.roles",
      "_access.owner",
      "_access.assignees",
      "_activity.assigned_by",
      // "_activity.assigned_at",
      "_activity.owner_changed_by",
      // "_activity.owner_changed_at",
      "_activity.credentials_changed_by",
      // "_activity.credentials_changed_at",
      "_activity.created_by",
      // "_activity.created_at",
      "_activity.updated_by",
      // "_activity.updated_at",
      "_activity.replaced_by",
      // "_activity.replaced_at",
      "_activity.expired_by",
      // "_activity.expired_at",
      "_activity.deleted_by",
      // "_activity.deleted_at",
      "_activity.archived_by",
      // "_activity.archived_at",
      "_activity.hidden_by",
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
          return self.collection(collectionName).index(indexField, { role: roleNameNormalized("user") });
        },
      });
    }

    for (let computeField of compute) {
      tasks.push({
        name: `Upserting viewable field (${computeField.field}) on (${collectionName})`,
        async task() {
          return self.collection(collectionName).compute(computeField, { role: roleNameNormalized("user") });
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

    return execute(tasks, {
      domain: "DB.collection.scaffold",
    });
  };
}
