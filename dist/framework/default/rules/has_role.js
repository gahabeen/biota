"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/api/rule");
exports.has_role = rule_1.RuleBuilder({
    name: "has_role",
    query: role => faunadb_1.query.Filter(faunadb_1.query.Select(["roles"], faunadb_1.query.Var("doc"), []), faunadb_1.query.Lambda(["role"], faunadb_1.query.Equals(faunadb_1.query.Role(role), faunadb_1.query.Var("role"))))
});
//# sourceMappingURL=has_role.js.map