"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("~/factory");
const tasks_1 = require("~/tasks");
function scaffold(collectionDefinition) {
    let self = this;
    return async function scaffoldMethod(options = {}) {
        let defaultSearchable = [
            "~ref",
            "~ts",
            "access.roles",
            "access.owner",
            "access.assignees",
            "activity.assigned_by",
            // "activity.assigned_at",
            "activity.owner_changed_by",
            // "activity.owner_changed_at",
            "activity.credentials_changed_by",
            // "activity.credentials_changed_at",
            "activity.created_by",
            // "activity.created_at",
            "activity.updated_by",
            // "activity.updated_at",
            "activity.replaced_by",
            // "activity.replaced_at",
            "activity.expired_by",
            // "activity.expired_at",
            "activity.deleted_by",
            // "activity.deleted_at",
            "activity.archived_by",
            // "activity.archived_at",
            "activity.hidden_by"
            // "activity.hidden_at"
        ];
        let { index = defaultSearchable, compute = [], field = [] } = options || {};
        let tasks = [
            {
                name: `Upserting collection (${collectionDefinition.name})`,
                async task() {
                    return self.query(factory_1.upsert.collection(collectionDefinition));
                }
            }
        ];
        for (let indexField of index) {
            tasks.push({
                name: `Upserting index field (${indexField}) on (${collectionDefinition.name})`,
                async task() {
                    return self.collection(collectionDefinition.name).index(indexField, { role: "user" });
                }
            });
        }
        for (let computeField of compute) {
            tasks.push({
                name: `Upserting viewable field (${computeField.field}) on (${collectionDefinition.name})`,
                async task() {
                    return self.collection(collectionDefinition.name).compute(computeField, { role: "user" });
                }
            });
        }
        for (let fieldField of field) {
            tasks.push({
                name: `Upserting viewable field (${fieldField.field}) on (${collectionDefinition.name})`,
                async task() {
                    return self.collection(collectionDefinition.name).field(fieldField);
                }
            });
        }
        return tasks_1.execute(tasks, {
            domain: "DB.collection.scaffold"
        });
    };
}
exports.scaffold = scaffold;
//# sourceMappingURL=scaffold.js.map