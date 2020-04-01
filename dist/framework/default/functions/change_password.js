"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.ChangePassword = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("ChangePassword"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "password"], WrapActionAndLog_1.WrapActionAndLog("credentials", faunadb_1.query.Update(faunadb_1.query.Var("ref"), {
        data: logData_1.logData.credentials(),
        credentials: {
            password: faunadb_1.query.Var("password")
        }
    })))),
});
//# sourceMappingURL=change_password.js.map