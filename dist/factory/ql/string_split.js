"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// Harvested from https://github.com/shiftx/faunadb-fql-lib/blob/master/src/functions/StringSplit.ts
exports.StringSplit = (string, delimiter = ".") => faunadb_1.query.If(faunadb_1.query.Not(faunadb_1.query.IsString(string)), faunadb_1.query.Abort("SplitString only accept strings"), faunadb_1.query.Map(faunadb_1.query.FindStrRegex(string, faunadb_1.query.Concat(["[^\\", delimiter, "]+"])), faunadb_1.query.Lambda("res", faunadb_1.query.Select(["data"], faunadb_1.query.Var("res")))));
//# sourceMappingURL=string_split.js.map