import { DB } from "~/db";
import { FaunaCollectionOptions, DBFrameworkCollectionScaffoldOptions } from "~/../types/db";
import { upsert } from "~/factory";
import { fieldDefinition } from "./field";
import { execute } from "~/tasks";

export function scaffold(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function scaffoldMethod(options: DBFrameworkCollectionScaffoldOptions = {}) {
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
        name: `Upserting collection (${collectionDefinition.name})`,
        async task() {
          return self.query(upsert.collection(collectionDefinition));
        },
      },
    ];

    for (let indexField of index) {
      tasks.push({
        name: `Upserting index field (${indexField}) on (${collectionDefinition.name})`,
        async task() {
          return self.collection(collectionDefinition.name).index(indexField, { role: "user" });
        },
      });
    }

    for (let computeField of compute) {
      tasks.push({
        name: `Upserting viewable field (${computeField.field}) on (${collectionDefinition.name})`,
        async task() {
          return self.collection(collectionDefinition.name).compute(computeField, { role: "user" });
        },
      });
    }

    for (let fieldField of field) {
      tasks.push({
        name: `Upserting viewable field (${fieldField.field}) on (${collectionDefinition.name})`,
        async task() {
          return self.collection(collectionDefinition.name).field(fieldField);
        },
      });
    }

    return execute(tasks, {
      domain: "DB.collection.scaffold",
    });
  };
}
