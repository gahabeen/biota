"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/api/rule");
exports.is_assignee = rule_1.Rule({
    name: "is_assignee",
    query: faunadb_1.query.Equals(faunadb_1.query.Select(["activity", "assignees"], faunadb_1.query.Var("doc"), null), faunadb_1.query.Identity())
});
//# sourceMappingURL=is_assignee.js.map