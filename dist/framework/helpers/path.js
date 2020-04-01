"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const string_split_1 = require("~/factory/ql/string_split");
function pathItems(path) {
    return faunadb_1.query.Let({
        pathArray: faunadb_1.query.If(faunadb_1.query.IsArray(path), faunadb_1.query.Map(path, faunadb_1.query.Lambda("part", faunadb_1.query.ToString(faunadb_1.query.Var("part")))), string_split_1.StringSplit(faunadb_1.query.ToString(path)))
    }, faunadb_1.query.If(faunadb_1.query.GT(faunadb_1.query.Count(faunadb_1.query.Var("pathArray")), 0), faunadb_1.query.If(faunadb_1.query.StartsWith(faunadb_1.query.Select(0, faunadb_1.query.Var("pathArray"), ""), "~"), faunadb_1.query.Drop(1, faunadb_1.query.Var("pathArray")), faunadb_1.query.Append(faunadb_1.query.Var("pathArray"), ["data"])), []));
}
exports.pathItems = pathItems;
function pathString(path) {
    return faunadb_1.query.Concat(pathItems(path), ".");
}
exports.pathString = pathString;
//# sourceMappingURL=path.js.map