"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const consts_1 = require("~/consts");
const rule_1 = require("~/factory/api/rule");
exports.is_document_available = rule_1.Rule({
    name: "is_document_available",
    query: faunadb_1.query.Let({
        deleted_at: faunadb_1.query.Select(["data", "activity", "deleted_at"], faunadb_1.query.Var("doc"), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS)),
        archived_at: faunadb_1.query.Select(["data", "activity", "archived_at"], faunadb_1.query.Var("doc"), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS)),
        expired_at: faunadb_1.query.Select(["data", "activity", "expired_at"], faunadb_1.query.Var("doc"), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS))
    }, faunadb_1.query.If(faunadb_1.query.LTE(faunadb_1.query.Var("deleted_at"), faunadb_1.query.Var("archived_at"), faunadb_1.query.Var("expired_at")), faunadb_1.query.Var("deleted_at"), faunadb_1.query.If(faunadb_1.query.LTE(faunadb_1.query.Var("archived_at"), faunadb_1.query.Var("expired_at"), faunadb_1.query.Var("deleted_at")), faunadb_1.query.Var("archived_at"), faunadb_1.query.Var("expired_at"))))
});
//# sourceMappingURL=is_document_available.js.map