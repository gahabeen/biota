"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/api/udfunction");
const index_1 = require("~/factory/api/index");
exports.FindIndex = udfunction_1.UDFunction({
    name: "FindIndex",
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["resource", "terms_fields"], faunadb_1.query.Let({
        indexes: faunadb_1.query.Paginate(faunadb_1.query.Intersection(faunadb_1.query.Match(faunadb_1.query.Index(index_1.BiotaIndexName("indexes__by__resource")), [
            faunadb_1.query.Var("resource")
        ]), faunadb_1.query.Union(faunadb_1.query.Map(faunadb_1.query.Var("terms_fields"), faunadb_1.query.Lambda(["field"], faunadb_1.query.Match(faunadb_1.query.Index(index_1.BiotaIndexName("indexes__by__terms")), [
            faunadb_1.query.Var("field")
        ])))))),
        termsCount: faunadb_1.query.Count(faunadb_1.query.Var("terms_fields")),
        filteredIndexes: faunadb_1.query.Filter(faunadb_1.query.Var("indexes"), faunadb_1.query.Lambda(["index"], faunadb_1.query.Equals(faunadb_1.query.Var("termsCount"), faunadb_1.query.Count(faunadb_1.query.Select("terms", faunadb_1.query.Get(faunadb_1.query.Var("index")), Infinity)))))
    }, faunadb_1.query.Select(0, faunadb_1.query.Var("filteredIndexes"), null)))),
    role: faunadb_1.query.Role("system")
});
//# sourceMappingURL=find_index.js.map