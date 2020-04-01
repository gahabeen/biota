"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/classes/collection");
const scaffold_1 = require("~/framework/api/collection/scaffold");
const field_1 = require("~/framework/api/collection/field");
const index_1 = require("~/framework/api/collection/index");
const compute_1 = require("~/framework/api/collection/compute");
const find_1 = require("~/framework/api/collection/find");
const paginate_1 = require("~/framework/api/collection/paginate");
const get_1 = require("~/framework/api/collection/get");
const insert_1 = require("~/framework/api/collection/insert");
const insertBatch_1 = require("~/framework/api/collection/insertBatch");
const replace_1 = require("~/framework/api/collection/replace");
const update_1 = require("~/framework/api/collection/update");
const repsert_1 = require("~/framework/api/collection/repsert");
const upsert_1 = require("~/framework/api/collection/upsert");
const delete_1 = require("~/framework/api/collection/delete");
const forget_1 = require("~/framework/api/collection/forget");
function collection(collectionNameOrOptions) {
    let self = this;
    let collectionDefinition = collection_1.Collection({});
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
        scaffold: scaffold_1.scaffold.call(self, collectionDefinition),
        field: field_1.field.call(self, collectionDefinition),
        index: index_1.index.call(self, collectionDefinition),
        compute: compute_1.compute.call(self, collectionDefinition),
        find: find_1.find.call(self, collectionDefinition),
        paginate: paginate_1.paginate.call(self, collectionDefinition),
        get: get_1.get.call(self, collectionDefinition),
        insert: insert_1.insert.call(self, collectionDefinition),
        insertBatch: insertBatch_1.insertBatch.call(self, collectionDefinition),
        replace: replace_1.replace.call(self, collectionDefinition),
        update: update_1.update.call(self, collectionDefinition),
        repsert: repsert_1.repsert.call(self, collectionDefinition),
        upsert: upsert_1.upsert.call(self, collectionDefinition),
        delete: delete_1.deleteFn.call(self, collectionDefinition),
        forget: forget_1.forget.call(self, collectionDefinition),
        async changes() { }
    };
    return methods;
}
exports.collection = collection;
//# sourceMappingURL=collection.js.map