"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const rule_1 = require("./../../../lib/rule");
const consts_1 = require("./../../../lib/consts");
exports.isFirstArgumentIdentity = rule_1.Rule({
    name: 'isFirstArgumentIdentity',
    lambda: faunadb_1.query.Lambda('args', faunadb_1.query.Equals(faunadb_1.query.Select(0, faunadb_1.query.Var('args'), null), faunadb_1.query.Identity()))
});
exports.isDocumentAvailable = rule_1.Rule({
    name: 'isDocumentAvailable',
    lambda: faunadb_1.query.Lambda('doc', faunadb_1.query.Let({
        deleted_at: faunadb_1.query.Select(['data', 'activity', 'deleted_at'], faunadb_1.query.Var('doc'), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS)),
        archived_at: faunadb_1.query.Select(['data', 'activity', 'archived_at'], faunadb_1.query.Var('doc'), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS)),
        expired_at: faunadb_1.query.Select(['data', 'activity', 'expired_at'], faunadb_1.query.Var('doc'), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS))
    }, faunadb_1.query.If(faunadb_1.query.LTE(faunadb_1.query.Var('deleted_at'), faunadb_1.query.Var('archived_at'), faunadb_1.query.Var('expired_at')), faunadb_1.query.Var('deleted_at'), faunadb_1.query.If(faunadb_1.query.LTE(faunadb_1.query.Var('archived_at'), faunadb_1.query.Var('expired_at'), faunadb_1.query.Var('deleted_at')), faunadb_1.query.Var('archived_at'), faunadb_1.query.Var('expired_at')))))
});
exports.hasRole = rule_1.RuleBuilder({
    name: 'hasRole',
    lambda: (role) => faunadb_1.query.Lambda('doc', faunadb_1.query.Filter(faunadb_1.query.Select(['private', 'roles'], faunadb_1.query.Var('doc'), []), faunadb_1.query.Lambda(['role'], faunadb_1.query.Equals(faunadb_1.query.Role(role), faunadb_1.query.Var('role')))))
});
exports.isOwner = rule_1.Rule({
    name: 'isOwner',
    lambda: faunadb_1.query.Lambda('ref', faunadb_1.query.Equals(faunadb_1.query.Select(['activity', 'owner'], faunadb_1.query.Get(faunadb_1.query.Var('ref')), null), faunadb_1.query.Identity()))
});
exports.isNotOwner = rule_1.Rule({
    name: 'isNotOwner',
    lambda: faunadb_1.query.Lambda('ref', faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select(['activity', 'owner'], faunadb_1.query.Get(faunadb_1.query.Var('ref')), null), faunadb_1.query.Identity())))
});
exports.isAssignee = rule_1.Rule({
    name: 'isAssignee',
    lambda: faunadb_1.query.Lambda('ref', faunadb_1.query.Equals(faunadb_1.query.Select(['activity', 'assignees'], faunadb_1.query.Get(faunadb_1.query.Var('ref')), null), faunadb_1.query.Identity()))
});
exports.isNotAssignee = rule_1.Rule({
    name: 'isNotAssignee',
    lambda: faunadb_1.query.Lambda('ref', faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select(['activity', 'assignees'], faunadb_1.query.Get(faunadb_1.query.Var('ref')), null), faunadb_1.query.Identity())))
});
exports.all = rule_1.Rule({
    name: 'all',
    lambda: true
});
exports.none = rule_1.Rule({
    name: 'none',
    lambda: false
});
exports.isSelf = rule_1.Rule({
    name: 'isSelf'
});
exports.isActivityNotChanged = rule_1.Rule({
    name: 'isActivityNotChanged'
});
exports.areRightsNotChanged = rule_1.Rule({
    name: 'isActivityNotChanged'
});
exports.verifySafeQuery = rule_1.Rules([exports.isActivityNotChanged, exports.areRightsNotChanged]);
//# sourceMappingURL=index.js.map