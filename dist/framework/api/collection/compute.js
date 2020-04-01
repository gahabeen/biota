"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_1 = require("~/factory/api/update");
// biota
const tasks_1 = require("~/tasks");
function compute(collectionDefinition) {
    let self = this;
    return async function computeMethod(field, options = {}) {
        let { role, roles } = options;
        let roleList = role || roles;
        if (!Array.isArray(roleList))
            roleList = [role];
        let tasks = [];
        tasks.push({
            name: `Scaffolding index field on ${collectionDefinition.name}`,
            async task() {
                return self
                    .collection(collectionDefinition.name)
                    .field({ ...field, action: "compute" })
                    .then(async (indexes) => {
                    for (let index of indexes) {
                        let { ref, name } = index || {};
                        if (name && role) {
                            let subTasks = [];
                            for (let r of roleList) {
                                subTasks.push({
                                    name: `Adding privilege (read) for index ${name} on ${r}`,
                                    task() {
                                        return self.query(update_1.update.role(r, {
                                            privileges: [
                                                {
                                                    resource: ref,
                                                    actions: {
                                                        read: true,
                                                        history_read: true
                                                    }
                                                }
                                            ]
                                        }));
                                    }
                                });
                            }
                            await tasks_1.execute(subTasks);
                        }
                    }
                    return indexes;
                });
            }
        });
        return tasks_1.execute(tasks, {
            domain: "DB.collection.compute"
        });
    };
}
exports.compute = compute;
//# sourceMappingURL=compute.js.map