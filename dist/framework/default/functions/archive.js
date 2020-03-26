"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/api/udfunction");
const wrapActionToLog_1 = require("~/framework/helpers/wrapActionToLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Archive = udfunction_1.UDFunction({
    name: "Archive",
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["user", "ref", "at"], wrapActionToLog_1.WrapActionToLog("archive", faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.archive() })))),
    role: faunadb_1.query.Role("AdminForUser")
});
//# sourceMappingURL=archive.js.map