"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const function_1 = require("./../methods/function");
exports.LogAction = function_1.UDFunction({
    name: 'LogAction',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['documentRef', 'ts', 'userRef', 'actionName'], faunadb_1.query.Create(faunadb_1.query.Collection('actions'), {
        data: {
            document: faunadb_1.query.Var('documentRef'),
            ts: faunadb_1.query.Var('ts'),
            user: faunadb_1.query.Var('userRef'),
            name: faunadb_1.query.Var('actionName')
        }
    })))
});
//# sourceMappingURL=action.js.map