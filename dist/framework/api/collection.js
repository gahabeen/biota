"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// biota
const index_1 = require("~/index");
const tasks_1 = require("~/tasks");
const helpers = require("~/helpers");
const index_2 = require("~/factory/api/index");
const udfunction_1 = require("~/factory/api/udfunction");
const upsert_1 = require("~/factory/api/upsert");
const update_1 = require("~/factory/api/update");
const collectionFactory = require("~/factory/api/collection");
function collection(collectionNameOrOptions) {
    let self = this;
    let collectionDefinition = {
        name: null,
        data: {},
        history_days: 30,
        ttl_days: null
    };
    if (typeof collectionNameOrOptions === "string") {
        collectionDefinition.name = collectionNameOrOptions;
    }
    else if (typeof collectionNameOrOptions === "object") {
        Object.assign(collectionDefinition, collectionNameOrOptions);
    }
    if (!collectionDefinition.name) {
        throw new Error("biota.collection() - no valid collection name");
    }
    let methods = {
        async field() { },
        async searchable() { },
        async scaffold() { },
        async search() { },
        async import(data) { }
    };
    methods.field = async function fieldMethod(field) {
        let options = {
            field: null,
            binding: null,
            unique: false,
            autocomplete: false,
            searchable: false,
            data: {},
            serialized: null,
            permissions: null,
            reverse: false
        };
        let index = {
            name: null,
            source: {
                collection: index_1.q.Collection(collectionDefinition.name),
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
        index.name = index_2.BiotaIndexName(helpers.name([
            collectionDefinition.name,
            "searchable",
            "by",
            helpers.stringPath(options.field)
        ]));
        index.terms = [
            {
                field: helpers.path(options.field),
                reverse: options.reverse
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
    };
    methods.searchable = async function searchable(field, options = {}) {
        let { role } = options;
        let tasks = [];
        tasks.push({
            name: `Adding searchable field ${field} on ${collectionDefinition.name}`,
            task() {
                let config = {
                    ...field,
                    searchable: true
                };
                if (typeof field === "string") {
                    config = { field, searchable: true };
                }
                return methods.field(config).then(async (res) => {
                    let { ref, name } = res[0] || {};
                    if (name && role) {
                        await tasks_1.execute([
                            {
                                name: `Adding privilege (read) for index ${name} on ${role}`,
                                task() {
                                    return self.query(update_1.update.role(role, {
                                        privileges: [
                                            {
                                                resource: ref,
                                                actions: {
                                                    read: true,
                                                    history_read: true
                                                }
                                            }
                                        ]
                                    }));
                                },
                                fullError: true
                            }
                        ]);
                    }
                    return res;
                });
            }
        });
        return tasks_1.execute(tasks);
    };
    methods.scaffold = async function scaffold() {
        let activitySearchableFields = [
            "~ref",
            "~ts"
            // "access.roles",
            // "access.owner",
            // "access.assignees",
            // "activity.assigned_by",
            // "activity.assigned_at",
            // "activity.owner_changed_by",
            // "activity.owner_changed_at",
            // "activity.credentials_changed_by",
            // "activity.credentials_changed_at",
            // "activity.imported_by",
            // "activity.imported_at",
            // "activity.created_by",
            // "activity.created_at",
            // "activity.updated_by",
            // "activity.updated_at",
            // "activity.replaced_by",
            // "activity.replaced_at",
            // "activity.expired_by",
            // "activity.expired_at",
            // "activity.deleted_by",
            // "activity.deleted_at",
            // "activity.archived_by",
            // "activity.archived_at",
            // "activity.hidden_by",
            // "activity.hidden_at"
        ];
        let tasks = [
            {
                name: `Upserting collection (${collectionDefinition.name})`,
                async task() {
                    return self.query(upsert_1.upsert.collection(collectionDefinition));
                }
            }
        ];
        for (let searchableField of activitySearchableFields) {
            tasks.push({
                name: `Upserting searchable field (${searchableField}) on (${collectionDefinition.name})`,
                async task() {
                    return methods.searchable(searchableField, { role: "user" });
                }
            });
        }
        return tasks_1.execute(tasks);
    };
    methods.import = async function importFunction(data, options = {}) {
        let { batchSize = 50, keepId = false } = options;
        let items = data;
        if (!Array.isArray(items))
            items = [items];
        let batches = helpers.splitEvery(batchSize, items);
        let tasks = [];
        let createQuery;
        if (!keepId) {
            createQuery = collectionFactory
                .collection(collectionDefinition.name)
                .create(index_1.q.Var("item"));
        }
        else {
            createQuery = collectionFactory
                .collection(collectionDefinition.name)
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
    };
    methods.search = function* search(searchTerms, paginateOptions = {}) {
        let firstRequest = true;
        let after;
        while (after || firstRequest) {
            if (firstRequest)
                firstRequest = false;
            yield self
                .query(index_1.q.Call(udfunction_1.BiotaUDFunctionName("Search"), [
                index_1.q.Collection(collectionDefinition.name),
                searchTerms,
                { after, ...paginateOptions }
            ]))
                .then((res) => {
                if (res.after) {
                    after = res.after;
                }
                else {
                    after = undefined;
                }
                return res;
            });
        }
    };
    return methods;
}
exports.collection = collection;
//# sourceMappingURL=collection.js.map