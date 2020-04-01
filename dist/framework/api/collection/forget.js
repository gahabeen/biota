"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function forget(collectionDefinition) {
    let self = this;
    return async function forgetMethod(id) {
        return tasks_1.execute([
            {
                name: `Forget (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).forget(id));
                }
            }
        ], {
            domain: "DB.collection.forget"
        });
    };
}
exports.forget = forget;
//# sourceMappingURL=forget.js.map