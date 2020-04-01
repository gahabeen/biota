"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function deleteFn(collectionDefinition) {
    let self = this;
    return async function deleteMethod(id) {
        return tasks_1.execute([
            {
                name: `Delete (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).delete(id));
                }
            }
        ], {
            domain: "DB.collection.delete"
        });
    };
}
exports.deleteFn = deleteFn;
//# sourceMappingURL=delete.js.map