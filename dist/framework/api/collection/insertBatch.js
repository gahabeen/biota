"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
const helpers = require("~/helpers");
// biota
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function insertBatch(collectionDefinition) {
    let self = this;
    return async function insertBatchMethod(data, options = {}) {
        let { batchSize = 50, keepId = false } = options;
        let items = data;
        if (!Array.isArray(items))
            items = [items];
        let batches = helpers.splitEvery(batchSize, items);
        let tasks = [];
        let query;
        if (keepId) {
            query = faunadb_1.query.Let({
                data: faunadb_1.query.Select("data", faunadb_1.query.Var("item"), {}),
                credentials: faunadb_1.query.Select("credentials", faunadb_1.query.Var("item"), {}),
                id: faunadb_1.query.Select("id", faunadb_1.query.Var("item"), null)
            }, faunadb_1.query.If(faunadb_1.query.Var("id"), collection_1.collection(collectionDefinition.name).upsert(faunadb_1.query.Var("data"), {
                id: faunadb_1.query.Var("id"),
                credentials: faunadb_1.query.Var("credentials")
            }), null));
        }
        else {
            query = collection_1.collection(collectionDefinition.name).insert(faunadb_1.query.Var("item"));
        }
        for (let [index, batch] of Object.entries(batches)) {
            tasks.push({
                name: `Inserting batch n°${index + 1} on ${batches.length}`,
                task() {
                    return self.query(faunadb_1.query.Map(batch, faunadb_1.query.Lambda("item", query)));
                }
            });
        }
        return tasks_1.execute(tasks, {
            domain: "DB.collection.insertBatch"
        });
    };
}
exports.insertBatch = insertBatch;
//# sourceMappingURL=insertBatch.js.map