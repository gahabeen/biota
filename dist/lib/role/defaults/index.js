"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const functions = require("./../../function");
const rules = require("./../../rule");
const role_1 = require("./../../role");
const { Rules } = rules;
exports.AdminForUser = role_1.Role({
    name: 'AdminForUser'
});
exports.Advanced = role_1.Role({
    name: 'Advanced',
    membership: {
        resource: faunadb_1.query.Collection('users'),
        predicate: faunadb_1.query.Query(rules.defaults.hasRole('Advanced'))
    },
    privileges: [
    // Privilege({
    //   resource: q.Function(functions.MatchHidden.name),
    //   actions: { call:"all" }
    // })
    ]
});
exports.User = role_1.Role({
    name: 'User',
    membership: {
        resource: faunadb_1.query.Collection('users'),
        predicate: faunadb_1.query.Query(rules.defaults.hasRole('User'))
    },
    privileges: [
        // collections
        role_1.CustomPrivilege({
            resource: faunadb_1.query.Collection('users'),
            actions: {
                create: faunadb_1.query.Query(rules.defaults.verifySafeQuery),
                delete: false,
                read: faunadb_1.query.Query(rules.defaults.isDocumentAvailable),
                write: faunadb_1.query.Query(rules.defaults.verifySafeQuery),
                history_read: false,
                history_write: false,
                unrestricted_read: false
            }
        }),
        // indexes
        // functions
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.Match.name), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.Owner.name), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.ChangePassword.name), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.Assign.name), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.Import.name), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.Create.name), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.Update.name), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.Replace.name), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.Expire.name), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.Delete.name), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function(functions.defaults.Archive.name), actions: { call: 'all' } })
    ]
});
//# sourceMappingURL=index.js.map