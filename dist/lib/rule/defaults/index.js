"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const rule_1 = require("./../../../lib/rule");
const consts_1 = require("./../../../lib/consts");
exports.is_first_argument_identity = rule_1.Rule({
    name: 'is_first_argument_identity',
    query: faunadb_1.query.Lambda('args', faunadb_1.query.Equals(faunadb_1.query.Select(0, faunadb_1.query.Var('args'), null), faunadb_1.query.Identity()))
});
exports.is_document_available = rule_1.Rule({
    name: 'is_document_available',
    query: faunadb_1.query.Let({
        deleted_at: faunadb_1.query.Select(['data', 'activity', 'deleted_at'], faunadb_1.query.Var('doc'), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS)),
        archived_at: faunadb_1.query.Select(['data', 'activity', 'archived_at'], faunadb_1.query.Var('doc'), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS)),
        expired_at: faunadb_1.query.Select(['data', 'activity', 'expired_at'], faunadb_1.query.Var('doc'), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS))
    }, faunadb_1.query.If(faunadb_1.query.LTE(faunadb_1.query.Var('deleted_at'), faunadb_1.query.Var('archived_at'), faunadb_1.query.Var('expired_at')), faunadb_1.query.Var('deleted_at'), faunadb_1.query.If(faunadb_1.query.LTE(faunadb_1.query.Var('archived_at'), faunadb_1.query.Var('expired_at'), faunadb_1.query.Var('deleted_at')), faunadb_1.query.Var('archived_at'), faunadb_1.query.Var('expired_at'))))
});
exports.has_role = rule_1.RuleBuilder({
    name: 'has_role',
    query: (role) => faunadb_1.query.Filter(faunadb_1.query.Select(['roles'], faunadb_1.query.Var('doc'), []), faunadb_1.query.Lambda(['role'], faunadb_1.query.Equals(faunadb_1.query.Role(role), faunadb_1.query.Var('role'))))
});
exports.is_owner = rule_1.Rule({
    name: 'is_owner',
    query: faunadb_1.query.Equals(faunadb_1.query.Select(['activity', 'owner'], faunadb_1.query.Var('doc'), null), faunadb_1.query.Identity())
});
exports.is_not_owner = rule_1.Rule({
    name: 'is_not_owner',
    query: faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select(['activity', 'owner'], faunadb_1.query.Var('doc'), null), faunadb_1.query.Identity()))
});
exports.is_assignee = rule_1.Rule({
    name: 'is_assignee',
    query: faunadb_1.query.Equals(faunadb_1.query.Select(['activity', 'assignees'], faunadb_1.query.Var('doc'), null), faunadb_1.query.Identity())
});
exports.is_not_assignee = rule_1.Rule({
    name: 'is_not_assignee',
    query: faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select(['activity', 'assignees'], faunadb_1.query.Var('doc'), null), faunadb_1.query.Identity()))
});
exports.all = rule_1.Rule({
    name: 'all',
    query: true
});
exports.none = rule_1.Rule({
    name: 'none',
    query: false
});
exports.is_self = rule_1.Rule({
    name: 'is_self'
});
exports.is_activity_not_changed = rule_1.Rule({
    name: 'is_activity_not_changed'
    // query: q.Lambda("ref")
});
exports.are_rights_not_changed = rule_1.Rule({
    name: 'are_rights_not_changed'
});
exports.very_safe_query = rule_1.Rules([exports.is_activity_not_changed, exports.are_rights_not_changed]);
//# sourceMappingURL=index.js.map