"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const functions = require("./functions");
const rules = require("./rules");
const role_1 = require("./roles/helpers/role");
const privilege_1 = require("./roles/helpers/privilege");
exports.AdminForUser = role_1.Role({
    name: 'AdminForUser'
});
exports.Advanced = role_1.Role({
    name: 'Advanced',
    membership: {
        resource: faunadb_1.query.Collection('users'),
        predicate: faunadb_1.query.Query(rules.hasRoleBuilder('Advanced'))
    },
    privileges: [
    // Privilege({
    //   resource: q.Function(functions.MatchHidden.name),
    //   actions: { call: rules.isFirstArgumentIdentity }
    // })
    ]
});
console.log("functions.Match", functions);
exports.User = role_1.Role({
    name: 'User',
    membership: {
        resource: faunadb_1.query.Collection('users'),
        predicate: faunadb_1.query.Query(rules.hasRoleBuilder('User'))
    },
    privileges: [
        // collections
        privilege_1.Privilege({
            resource: faunadb_1.query.Collection('users'),
            actions: {
                create: faunadb_1.query.Query(rules.verifySafeQuery),
                delete: false,
                read: faunadb_1.query.Query(rules.isDocumentAvailable),
                write: faunadb_1.query.Query(rules.verifySafeQuery),
                history_read: false,
                history_write: false,
                unrestricted_read: false
            }
        }),
        // indexes
        // functions
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.Match.name), actions: { call: rules.isFirstArgumentIdentity } }),
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.Owner.name), actions: { call: rules.isFirstArgumentIdentity } }),
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.ChangePassword.name), actions: { call: rules.isFirstArgumentIdentity } }),
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.Assign.name), actions: { call: rules.isFirstArgumentIdentity } }),
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.Import.name), actions: { call: rules.isFirstArgumentIdentity } }),
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.Create.name), actions: { call: rules.isFirstArgumentIdentity } }),
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.Update.name), actions: { call: rules.isFirstArgumentIdentity } }),
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.Replace.name), actions: { call: rules.isFirstArgumentIdentity } }),
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.Expire.name), actions: { call: rules.isFirstArgumentIdentity } }),
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.Delete.name), actions: { call: rules.isFirstArgumentIdentity } }),
        privilege_1.Privilege({ resource: faunadb_1.query.Function(functions.Archive.name), actions: { call: rules.isFirstArgumentIdentity } })
    ]
});
//# sourceMappingURL=roles.js.map