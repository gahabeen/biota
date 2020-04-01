"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function replace(collectionDefinition) {
    let self = this;
    return async function replaceMethod(id, data) {
        return tasks_1.execute([
            {
                name: `Replace (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).replace(id, data));
                }
            }
        ], {
            domain: "DB.collection.replace"
        });
    };
}
exports.replace = replace;
//# sourceMappingURL=replace.js.map