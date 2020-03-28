"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/api/udfunction");
exports.WrapActionToLog = (action, fql) => {
    return faunadb_1.query.Let({
        doc: fql,
        action: faunadb_1.query.If(faunadb_1.query.Select("ref", faunadb_1.query.Var("doc"), null), faunadb_1.query.Call(udfunction_1.BiotaUDFunctionName("LogAction"), [
            faunadb_1.query.Select("ref", faunadb_1.query.Var("doc")),
            faunadb_1.query.Select("ts", faunadb_1.query.Var("doc")),
            faunadb_1.query.Identity(),
            action
        ]), null)
    }, {
        doc: faunadb_1.query.Var("doc"),
        action: faunadb_1.query.Var("action")
    });
};
//# sourceMappingURL=wrapActionToLog.js.map