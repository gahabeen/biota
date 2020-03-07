"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const rule_1 = require("./roles/helpers/rule");
const consts_1 = require("./consts");
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
exports.hasRoleBuilder = rule_1.RuleBuilder({
    name: 'hasRole',
    lambda: (role) => faunadb_1.query.Lambda('doc', faunadb_1.query.Filter(faunadb_1.query.Select(['private', 'roles'], faunadb_1.query.Var('doc'), []), faunadb_1.query.Lambda(['role'], faunadb_1.query.Equals(faunadb_1.query.Role(role), faunadb_1.query.Var('role')))))
});
exports.isOwner = rule_1.Rule({
    name: 'isOwner'
});
exports.isAssigned = rule_1.Rule({
    name: 'isAssigned'
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
//# sourceMappingURL=rules.js.map