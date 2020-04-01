"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Delete = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Delete"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "at"], WrapActionAndLog_1.WrapActionAndLog("delete", faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.delete() })))),
});
//# sourceMappingURL=delete.js.map