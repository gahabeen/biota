"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
exports.Forget = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Forget"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "at"], WrapActionAndLog_1.WrapActionAndLog("forget", faunadb_1.query.Delete(faunadb_1.query.Var("ref"))))),
});
//# sourceMappingURL=forget.js.map