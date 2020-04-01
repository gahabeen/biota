"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("~/factory");
const tasks_1 = require("~/tasks");
function index(collectionDefinition) {
    let self = this;
    return async function indexMethod(field, options = {}) {
        let { role, roles, maxLength } = options;
        let roleList = role || roles;
        if (!Array.isArray(roleList))
            roleList = [role];
        let tasks = [];
        let definition = {
            field: null,
            action: "index",
            ngram: false,
            ngramMax: maxLength
        };
        if (typeof field === "string") {
            definition.field = field;
        }
        else if (typeof field === "object") {
            Object.assign(definition, field);
        }
        tasks.push({
            name: `Adding index field ${definition.field} on ${collectionDefinition.name}`,
            async task() {
                return self
                    .collection(collectionDefinition.name)
                    .field(definition)
                    .then(async (indexes) => {
                    for (let index of indexes) {
                        let { ref, name } = index || {};
                        if (name && role) {
                            let subTasks = [];
                            for (let r of roleList) {
                                subTasks.push({
                                    name: `Adding privilege (read) for index ${name} on ${r}`,
                                    task() {
                                        return self.query(factory_1.update.role(r, {
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
                                    },
                                    fullError: true
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
            domain: "DB.collection.index"
        });
    };
}
exports.index = index;
//# sourceMappingURL=index.js.map