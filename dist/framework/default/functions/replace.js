"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/api/udfunction");
const wrapActionToLog_1 = require("~/framework/helpers/wrapActionToLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Replace = udfunction_1.UDFunction({
    name: "Replace",
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["user", "ref", "data"], wrapActionToLog_1.WrapActionToLog("replace", faunadb_1.query.Do(faunadb_1.query.Replace(faunadb_1.query.Var("ref"), { data: faunadb_1.query.Var("data") }), faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.replace() }))))),
});
//# sourceMappingURL=replace.js.map