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
        async value() { },
        async field() { },
        async viewable() { },
        async searchable() { },
        async autocomplete() { },
        async scaffold() { },
        async search() { },
        async *paginate() { },
        async import(data) { }
    };
    const valueDefinition = (value) => {
        let options = {
            field: null,
            binding: null,
            unique: false,
            serialized: null,
            data: {}
        };
        Object.assign(options, value);
        return options;
    };
    methods.value = async function valueMethod(value) {
        let definition = valueDefinition(value);
        let index = {
            name: null,
            source: {
                collection: index_1.q.Collection(collectionDefinition.name),
                fields: {
                    [definition.field]: definition.binding
                }
            },
            terms: [
                {
                    field: "ref"
                }
            ],
            values: [
                {
                    binding: definition.field
                }
            ],
            unique: definition.unique,
            serialized: definition.serialized,
            data: definition.data
        };
        index.name = index_2.BiotaIndexName(helpers.name([collectionDefinition.name, "view", "as", definition.field]));
        let tasks = [
            {
                name: `Creating (value) index: ${index.name}`,
                async task() {
                    return self.query(upsert_1.upsert.index(index));
                }
            }
        ];
        return tasks_1.execute(tasks);
    };
    methods.field = async function fieldMethod(field) {
        let definition = {
            field: null,
            binding: null,
            unique: false,
            ngram: false,
            ngramMin: 3,
            ngramMax: 10,
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
            unique: definition.unique,
            serialized: definition.serialized,
            permissions: definition.permissions,
            data: definition.data
        };
        if (typeof field === "string") {
            definition.field = field;
        }
        else if (typeof field === "object") {
            Object.assign(definition, field);
        }
        if (!definition.field) {
            throw new Error(`biota.field() - no field name has been given`);
        }
        index.name = index_2.BiotaIndexName(helpers.name([
            collectionDefinition.name,
            "searchable",
            "by",
            helpers.stringPath(definition.field)
        ]));
        index.terms = [
            {
                field: helpers.path(definition.field),
                reverse: definition.reverse
            }
        ];
        let tasks = [];
        if (definition.searchable) {
            tasks.push({
                name: `Creating (search) index: ${index.name}`,
                async task() {
                    return self.query(upsert_1.upsert.index(index));
                }
            });
        }
        if (definition.ngram) {
            let ngramFieldName = "ngram:" + helpers.stringPath(definition.field);
            let ngramIndex = {
                name: index_2.BiotaIndexName(helpers.name([
                    collectionDefinition.name,
                    "ngram",
                    "on",
                    helpers.stringPath(definition.field)
                ])),
                source: {
                    collection: index_1.q.Collection(collectionDefinition.name),
                    fields: {
                        [ngramFieldName]: index_1.q.Query(index_1.q.Lambda("instance", index_1.q.Distinct(index_2.NGramOnField(definition.ngramMax, helpers.path(definition.field)))))
                    }
                },
                terms: [
                    {
                        binding: ngramFieldName
                    }
                ],
                serialized: true,
                data: definition.data
            };
            tasks.push({
                name: `Creating (ngram search) index: ${ngramIndex.name}`,
                async task() {
                    return self.query(upsert_1.upsert.index(ngramIndex));
                },
                fullError: true
            });
        }
        return tasks_1.execute(tasks);
    };
    methods.viewable = async function viewable(value, options = {}) {
        let { role, roles } = options;
        let roleList = role || roles;
        if (!Array.isArray(roleList))
            roleList = [role];
        let tasks = [];
        let definition = valueDefinition(value);
        tasks.push({
            name: `Adding viewbale field ${definition.field} on ${collectionDefinition.name}`,
            task() {
                return methods.value(definition).then(async (res) => {
                    let { ref, name } = res[0] || {};
                    if (name && role) {
                        let subTasks = [];
                        for (let r of roleList) {
                            subTasks.push({
                                name: `Adding privilege (read) for index ${name} on ${r}`,
                                task() {
                                    return self.query(update_1.update.role(r, {
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
                                }
                            });
                        }
                        await tasks_1.execute(subTasks);
                    }
                    return res;
                });
            }
        });
        return tasks_1.execute(tasks);
    };
    methods.searchable = async function searchable(field, options = {}) {
        let { role, roles } = options;
        let roleList = role || roles;
        if (!Array.isArray(roleList))
            roleList = [role];
        let tasks = [];
        let definition = {
            field: null,
            searchable: true
        };
        if (typeof field === "string") {
            definition.field = field;
        }
        else if (typeof field === "object") {
            Object.assign(definition, field);
        }
        tasks.push({
            name: `Adding searchable field ${definition.field} on ${collectionDefinition.name}`,
            task() {
                return methods.field(definition).then(async (res) => {
                    let { ref, name } = res[0] || {};
                    if (name && role) {
                        let subTasks = [];
                        for (let r of roleList) {
                            subTasks.push({
                                name: `Adding privilege (read) for index ${name} on ${r}`,
                                task() {
                                    return self.query(update_1.update.role(r, {
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
                            });
                        }
                        await tasks_1.execute(subTasks);
                    }
                    return res;
                });
            }
        });
        return tasks_1.execute(tasks);
    };
    methods.autocomplete = async function autocomplete(field, options = {}) {
        let { role, roles, maxLength } = options;
        let roleList = role || roles;
        if (!Array.isArray(roleList))
            roleList = [role];
        let tasks = [];
        let definition = {
            field: null,
            ngram: true,
            searchable: false,
            ngramMax: maxLength
        };
        if (typeof field === "string") {
            definition.field = field;
        }
        else if (typeof field === "object") {
            Object.assign(definition, field);
        }
        tasks.push({
            name: `Adding ngram field ${definition.field} on ${collectionDefinition.name}`,
            task() {
                return methods.field(definition).then(async (res) => {
                    let { ref, name } = res[0] || {};
                    if (name && role) {
                        let subTasks = [];
                        for (let r of roleList) {
                            subTasks.push({
                                name: `Adding privilege (read) for index ${name} on ${r}`,
                                task() {
                                    return self.query(update_1.update.role(r, {
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
                            });
                        }
                        await tasks_1.execute(subTasks);
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
            "~ts",
            "access.roles",
            "access.owner",
            "access.assignees",
            "activity.assigned_by",
            // "activity.assigned_at",
            "activity.owner_changed_by",
            // "activity.owner_changed_at",
            "activity.credentials_changed_by",
            // "activity.credentials_changed_at",
            "activity.imported_by",
            // "activity.imported_at",
            "activity.created_by",
            // "activity.created_at",
            "activity.updated_by",
            // "activity.updated_at",
            "activity.replaced_by",
            // "activity.replaced_at",
            "activity.expired_by",
            // "activity.expired_at",
            "activity.deleted_by",
            // "activity.deleted_at",
            "activity.archived_by",
            // "activity.archived_at",
            "activity.hidden_by",
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
    /**
     * db.collection("users").search({$or: [{ "profile.name": "Gabin" }, { "profile.email": "de@gmail.com" }]})
     */
    function parseSearchQuery(collection, searchQuery) {
        const buildQuery = (sq) => {
            return index_1.q.Call(udfunction_1.BiotaUDFunctionName("SearchQuery"), [
                index_1.q.Collection(collection),
                sq
            ]);
        };
        const safe = (x) => JSON.parse(JSON.stringify(x));
        const operators = {
            $and: (...queries) => {
                return index_1.q.Intersection(...queries.map(buildQuery));
            },
            $or: (...queries) => {
                console.log("queries", queries);
                return index_1.q.Union(...queries.map(buildQuery));
            },
            $nor: (query, ...queries) => {
                return index_1.q.Difference(buildQuery(query), ...queries.map(buildQuery));
            }
            // $not: (source: Fauna.Expr, query: Fauna.Expr) =>
            //   q.Difference(source, query)
            // $distinct: (queries: Fauna.Expr[]) => q.Distinct(queries)
        };
        const isOperator = (key) => Object.keys(operators).includes(key);
        const hasOperators = (obj) => Object.keys(obj).some(key => Object.keys(operators).includes(key));
        const getFirstOperator = (obj) => {
            return Object.keys(obj).find(key => isOperator(key));
        };
        // UPDATE!
        const reducer = (obj) => {
            let reduced = {};
            const reducee = (value, acc) => {
                if (typeof value === "object") {
                    if (hasOperators(value)) {
                        let operator = getFirstOperator(value);
                        let operatorValue = value[operator];
                        let operation = operators[operator](...operatorValue);
                        Object.assign(acc, operation);
                    }
                    else {
                        for (let key in value) {
                            acc[key] = {};
                            reducee(value[key], acc[key]);
                        }
                    }
                }
                else if (Array.isArray(value)) {
                    acc = value.map((item) => {
                        if (typeof item === "object" || Array.isArray(item)) {
                            return reducer(item);
                        }
                        else {
                            return item;
                        }
                    });
                }
                else {
                    acc = value;
                }
            };
            reducee(obj, reduced);
            return reduced;
        };
        if (!searchQuery) {
            return index_1.q.Documents(index_1.q.Collection(collection));
        }
        if (!hasOperators(searchQuery)) {
            return buildQuery(searchQuery);
        }
        else {
            return reducer(searchQuery);
        }
    }
    methods.search = async function search(searchQuery, paginateOptions = {}, mapper) {
        let paginate = index_1.q.Paginate(parseSearchQuery(collectionDefinition.name, searchQuery), paginateOptions);
        return self.query(mapper ? index_1.q.Map(paginate, mapper) : paginate);
    };
    methods.paginate = async function* paginate(searchQuery, paginateOptions = {}, mapper = index_1.q.Lambda("x", index_1.q.Get(index_1.q.Var("x")))) {
        let firstRequest = true;
        let after;
        let paginate = index_1.q.Paginate(parseSearchQuery(collectionDefinition.name, searchQuery), { after, ...paginateOptions });
        while (after || firstRequest) {
            if (firstRequest)
                firstRequest = false;
            yield self
                .query(mapper ? index_1.q.Map(paginate, mapper) : paginate)
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
//   methods.search = function* search(
//     searchTerms: DBFrameworkCollectionSearchParams,
//     paginateOptions: FaunaPaginateOptions = {}
//   ) {
//     let firstRequest = true;
//     let after: any;
//     while (after || firstRequest) {
//       if (firstRequest) firstRequest = false;
//       yield self
//         .query(
//           q.Call(BiotaUDFunctionName("Search"), [
//             q.Collection(collectionDefinition.name),
//             searchTerms,
//             { after, ...paginateOptions }
//           ])
//         )
//         .then((res: FaunaPaginateResponse) => {
//           if (res.after) {
//             after = res.after;
//           } else {
//             after = undefined;
//           }
//           return res;
//         });
//     }
//   };
//   return methods;
// }
//# sourceMappingURL=collection.js.map