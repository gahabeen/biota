"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/api/rule");
exports.is_self = rule_1.Rule({
    name: "is_self",
    query: faunadb_1.query.Equals(faunadb_1.query.Var("ref"), faunadb_1.query.Identity())
});
//# sourceMappingURL=is_self.js.map