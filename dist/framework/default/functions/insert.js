"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Insert = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Insert"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "collectionRef", "data"], WrapActionAndLog_1.WrapActionAndLog("insert", faunadb_1.query.Create(faunadb_1.query.Var("collectionRef"), { data: logData_1.logData.insert() }))))
});
//# sourceMappingURL=insert.js.map