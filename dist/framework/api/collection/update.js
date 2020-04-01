"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function update(collectionDefinition) {
    let self = this;
    return async function updateMethod(id, data) {
        return tasks_1.execute([
            {
                name: `Update (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).update(id, data));
                }
            }
        ], {
            domain: "DB.collection.update"
        });
    };
}
exports.update = update;
//# sourceMappingURL=update.js.map