"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const collection_1 = require("~/factory/classes/collection");
exports.LogAction = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("LogAction"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["documentRef", "ts", "userRef", "actionName"], faunadb_1.query.Create(faunadb_1.query.Collection(collection_1.collectionNameNormalized("actions")), {
        data: {
            document: faunadb_1.query.Var("documentRef"),
            ts: faunadb_1.query.Var("ts"),
            user: faunadb_1.query.Var("userRef"),
            name: faunadb_1.query.Var("actionName")
        }
    })))
});
//# sourceMappingURL=log_action.js.map