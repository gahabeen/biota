"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/api/udfunction");
const wrapActionToLog_1 = require("~/framework/helpers/wrapActionToLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Create = udfunction_1.UDFunction({
    name: "Create",
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "collectionRef", "data"], wrapActionToLog_1.WrapActionToLog("create", faunadb_1.query.Create(faunadb_1.query.Var("collectionRef"), { data: logData_1.logData.create() }))))
});
//# sourceMappingURL=create.js.map