"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/api/udfunction");
const wrapActionToLog_1 = require("~/framework/helpers/wrapActionToLog");
exports.Forget = udfunction_1.UDFunction({
    name: "Forget",
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["user", "ref", "at"], wrapActionToLog_1.WrapActionToLog("forget", faunadb_1.query.Delete(faunadb_1.query.Var("ref"))))),
    role: faunadb_1.query.Role("AdminForUser")
});
//# sourceMappingURL=forget.js.map