"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
// biota
const index_1 = require("~/index");
const tasks_1 = require("~/tasks");
const helpers = require("~/helpers");
const index_2 = require("~/factory/api/index");
const upsert_1 = require("~/factory/api/upsert");
const collectionFactory = require("~/factory/api/collection");
function collection(collectionName) {
    let self = this;
    async function fieldMethod(field) {
        let options = {
            field: null,
            binding: null,
            unique: false,
            autocomplete: false,
            searchable: false,
            data: {},
            serialized: null,
            permissions: null
        };
        let index = {
            name: null,
            source: {
                collection: index_1.q.Collection(collectionName),
                fields: {}
            },
            terms: [],
            values: [],
            unique: options.unique,
            serialized: options.serialized,
            permissions: options.permissions,
            data: options.data
        };
        if (typeof field === "string") {
            options.field = field;
        }
        else if (typeof field === "object") {
            Object.assign(options, field);
        }
        if (!options.field) {
            throw new Error(`biota.field() - no field name has been given`);
        }
        index.name = index_2.IndexName(helpers.name([
            collectionName,
            "searchable",
            "by",
            helpers.stringPath(options.field)
        ]));
        index.terms = [
            {
                field: helpers.path(options.field)
            }
        ];
        let tasks = [
            {
                name: `Creating index: ${index.name}`,
                async task() {
                    return self.query(upsert_1.upsert.index(index));
                }
            }
        ];
        return tasks_1.execute(tasks);
    }
    return {
        field: fieldMethod,
        async searchable(field) {
            if (typeof field === "string") {
                return fieldMethod({ field, searchable: true });
            }
            else {
                return fieldMethod({ ...field, searchable: true });
            }
        },
        async scaffold() {
            let tasks = [
                {
                    name: `Creating collection: ${collectionName}`,
                    async task() {
                        return self.query(upsert_1.upsert.collection({
                            name: collectionName,
                            history_days: null,
                            ttl_days: null
                        }));
                    }
                }
            ];
            return tasks_1.execute(tasks);
        },
        async search(params) { },
        async import(data, options = {}) {
            let { batchSize = 50, keepId = false } = options;
            let items = data;
            if (!Array.isArray(items))
                items = [items];
            let batches = helpers.splitEvery(batchSize, items);
            let tasks = [];
            let createQuery;
            if (!keepId) {
                createQuery = collectionFactory
                    .collection(collectionName)
                    .create(index_1.q.Var("item"));
            }
            else {
                createQuery = collectionFactory
                    .collection(collectionName)
                    .upsert(index_1.q.Select("id", index_1.q.Var("item"), null), index_1.q.Select("data", index_1.q.Var("item"), null));
            }
            for (let [index, batch] of Object.entries(batches)) {
                tasks.push({
                    name: `Importing batch n°${index + 1} on ${batches.length}`,
                    task() {
                        return self.query(index_1.q.Map(batch, index_1.q.Lambda("item", createQuery)));
                    }
                });
            }
            return tasks_1.execute(tasks);
        }
    };
}
exports.collection = collection;
//# sourceMappingURL=collection.js.map