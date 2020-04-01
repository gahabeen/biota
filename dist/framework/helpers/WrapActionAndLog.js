"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const ql_1 = require("~/factory/api/ql");
exports.WrapActionAndLog = (action, fql) => {
    return faunadb_1.query.Let({
        doc: fql,
        action: faunadb_1.query.If(faunadb_1.query.IsRef(faunadb_1.query.Select("ref", faunadb_1.query.Var("doc"), null)), faunadb_1.query.Call(udfunction_1.udfunctionNameNormalized("LogAction"), faunadb_1.query.Select("ref", faunadb_1.query.Var("doc")), faunadb_1.query.Select("ts", faunadb_1.query.Var("doc")), ql_1.Identity(), action), null)
    }, {
        doc: faunadb_1.query.Var("doc"),
        action: faunadb_1.query.Var("action")
    });
};
//# sourceMappingURL=WrapActionAndLog.js.map