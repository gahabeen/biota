"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function get(collectionDefinition) {
    let self = this;
    return async function getMethod(id) {
        return tasks_1.execute([
            {
                name: `Get (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).get(id));
                }
            }
        ], {
            domain: "DB.collection.get"
        });
    };
}
exports.get = get;
//# sourceMappingURL=get.js.map