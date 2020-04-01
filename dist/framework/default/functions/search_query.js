"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const index_1 = require("~/factory/classes/index");
const path_1 = require("~/framework/helpers/path");
exports.SearchQuery = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("SearchQuery"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["resource", "search_terms"], faunadb_1.query.Let({
        searchTerms: faunadb_1.query.ToArray(faunadb_1.query.Var("search_terms")),
        termIndexes: faunadb_1.query.Map(faunadb_1.query.Var("searchTerms"), faunadb_1.query.Lambda(["field", "value"], faunadb_1.query.If(faunadb_1.query.IsObject(faunadb_1.query.Var("value")), faunadb_1.query.If(faunadb_1.query.Contains("$ngram", faunadb_1.query.Var("value")), [
            faunadb_1.query.Call(index_1.indexNameNormalized("FindIndex"), [
                faunadb_1.query.Var("resource"),
                [faunadb_1.query.Concat(["binding:", "ngram:", faunadb_1.query.Var("field")])]
            ]),
            faunadb_1.query.LowerCase(faunadb_1.query.ToString(faunadb_1.query.Select("$ngram", faunadb_1.query.Var("value"), ""))),
            faunadb_1.query.Concat(["ngram:", path_1.pathString(faunadb_1.query.Var("field"))])
        ], [null, null, null]), [
            faunadb_1.query.Call(index_1.indexNameNormalized("FindIndex"), [
                faunadb_1.query.Var("resource"),
                [faunadb_1.query.Concat(["term:", path_1.pathString(faunadb_1.query.Var("field"))])]
            ]),
            faunadb_1.query.Var("value"),
            faunadb_1.query.Var("field")
        ]))),
        validTermIndexes: faunadb_1.query.Filter(faunadb_1.query.Var("termIndexes"), faunadb_1.query.Lambda(["index", "value", "field"], faunadb_1.query.IsIndex(faunadb_1.query.Var("index")))),
        unvalidIndexes: faunadb_1.query.Filter(faunadb_1.query.Var("termIndexes"), faunadb_1.query.Lambda(["index", "value", "field"], faunadb_1.query.Not(faunadb_1.query.IsIndex(faunadb_1.query.Var("index"))))),
        unvalidFields: faunadb_1.query.Concat(faunadb_1.query.Map(faunadb_1.query.Var("unvalidIndexes"), faunadb_1.query.Lambda(["index", "value", "field"], faunadb_1.query.Var("field"))), ", ")
    }, faunadb_1.query.If(faunadb_1.query.LT(faunadb_1.query.Count(faunadb_1.query.Var("unvalidIndexes")), 1), faunadb_1.query.Intersection(faunadb_1.query.Map(faunadb_1.query.Var("validTermIndexes"), faunadb_1.query.Lambda(["index", "value", "field"], faunadb_1.query.Match(faunadb_1.query.Var("index"), faunadb_1.query.Var("value"))))), faunadb_1.query.Abort(faunadb_1.query.Concat([
        "Indexes couldn't be found for field(s): ",
        faunadb_1.query.Concat(faunadb_1.query.Var("unvalidFields"), ", ")
    ], " "))))))
});
//# sourceMappingURL=search_query.js.map