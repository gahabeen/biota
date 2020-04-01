"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
exports.Match = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Match"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["user", "collectionRef", "terms"], faunadb_1.query.Match(faunadb_1.query.Var("refIndex"), faunadb_1.query.Var("terms"))))
});
//# sourceMappingURL=match.js.map