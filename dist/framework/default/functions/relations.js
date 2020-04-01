"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const collection_1 = require("~/factory/classes/collection");
exports.Relations = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Relations"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref"], faunadb_1.query.If(faunadb_1.query.And(faunadb_1.query.IsRef(faunadb_1.query.Var("ref")), faunadb_1.query.Exists(faunadb_1.query.Var("ref"))), faunadb_1.query.Let({
        relations: faunadb_1.query.Map(faunadb_1.query.Paginate(faunadb_1.query.Call(udfunction_1.udfunctionNameNormalized("SearchQuery"), [
            faunadb_1.query.Collection(collection_1.collectionNameNormalized("relations")),
            {
                "parts.collection": faunadb_1.query.Select("collection", faunadb_1.query.Var("ref"), null)
            }
        ]), { size: 1000 }), x => faunadb_1.query.Get(x))
    }, faunadb_1.query.If(faunadb_1.query.Not(faunadb_1.query.IsEmpty(faunadb_1.query.Var("relations"))), faunadb_1.query.Var("relations"), [])), faunadb_1.query.Abort("Ref doesn't exists"))))
});
//# sourceMappingURL=relations.js.map