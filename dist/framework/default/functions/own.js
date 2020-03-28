"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/api/udfunction");
const wrapActionToLog_1 = require("~/framework/helpers/wrapActionToLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Own = udfunction_1.UDFunction({
    name: "Own",
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["user", "ref", "data"], wrapActionToLog_1.WrapActionToLog("own", faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.own() })))),
});
//# sourceMappingURL=own.js.map