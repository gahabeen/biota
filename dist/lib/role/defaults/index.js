"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
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
        predicate: faunadb_1.query.Query(rules.has_role('Advanced'))
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
        predicate: faunadb_1.query.Query(rules.has_role('User'))
    },
    privileges: [
        // collections
        role_1.CustomPrivilege({
            resource: faunadb_1.query.Collection('users'),
            actions: {
                create: faunadb_1.query.Query(rules.very_safe_query),
                delete: false,
                read: faunadb_1.query.Query(rules.is_document_available),
                write: faunadb_1.query.Query(rules.very_safe_query),
                history_read: false,
                history_write: false,
                unrestricted_read: false
            }
        }),
        // indexes
        // functions
        role_1.Privilege({ resource: faunadb_1.query.Function('Match'), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function('Owner'), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function('ChangePassword'), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function('Assign'), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function('Import'), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function('Create'), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function('Update'), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function('Replace'), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function('Expire'), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function('Delete'), actions: { call: 'all' } }),
        role_1.Privilege({ resource: faunadb_1.query.Function('Archive'), actions: { call: 'all' } })
    ]
});
//# sourceMappingURL=index.js.map