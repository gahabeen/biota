"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function insert(collectionDefinition) {
    let self = this;
    return async function insertMethod(data, options) {
        let { keepId = false } = options || {};
        const { id, credentials } = data || {};
        return tasks_1.execute([
            {
                name: (keepId ? `Upserting ${id}` : `Inserting`) + ` in ${collectionDefinition.name}`,
                task() {
                    if (keepId) {
                        if (!id)
                            throw new Error(`Doesn't have any given id`);
                        return self.query(collection_1.collection(collectionDefinition.name).upsert(data.data || {}, { id, credentials }));
                    }
                    else {
                        return self.query(collection_1.collection(collectionDefinition.name).insert(data));
                    }
                }
            }
        ], {
            domain: "DB.collection.insert"
        });
    };
}
exports.insert = insert;
//# sourceMappingURL=insert.js.map