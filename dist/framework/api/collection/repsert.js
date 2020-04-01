"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function repsert(collectionDefinition) {
    let self = this;
    return async function repsertMethod(id, data) {
        return tasks_1.execute([
            {
                name: `Replace/Insert (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).repsert(id, data));
                }
            }
        ], {
            domain: "DB.collection.repsert"
        });
    };
}
exports.repsert = repsert;
//# sourceMappingURL=repsert.js.map