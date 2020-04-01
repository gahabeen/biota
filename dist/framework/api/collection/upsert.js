"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function upsert(collectionDefinition) {
    let self = this;
    return async function upsertMethod(id, data) {
        return tasks_1.execute([
            {
                name: `Update/Insert (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).upsert(id, data));
                }
            }
        ], {
            domain: "DB.collection.upsert"
        });
    };
}
exports.upsert = upsert;
//# sourceMappingURL=upsert.js.map