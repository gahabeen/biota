"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const helpers_1 = require("~/helpers");
exports.update = {
    database: function databaseUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Database(name), options);
    },
    collection: function collectionUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Collection(name), options);
    },
    index: function indexUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Index(name), options);
    },
    function: function functionUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Function(name), options);
    },
    role: function roleUpdate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        let membership = definition.membership || [];
        if (!Array.isArray(membership))
            membership = [membership];
        let privileges = definition.privileges || [];
        return faunadb_1.query.Let({
            role: faunadb_1.query.Get(faunadb_1.query.Role(definition.name)),
            memberships: faunadb_1.query.Select("membership", faunadb_1.query.Var("role"), []),
            privileges: faunadb_1.query.Select("privileges", faunadb_1.query.Var("role"), []),
            membershipArray: faunadb_1.query.If(faunadb_1.query.IsArray(faunadb_1.query.Var("memberships")), faunadb_1.query.Var("memberships"), [faunadb_1.query.Var("memberships")]),
            filteredPrivileges: faunadb_1.query.Filter(faunadb_1.query.Var("privileges"), faunadb_1.query.Lambda("privilege", faunadb_1.query.Let({
                checks: faunadb_1.query.Map(privileges, faunadb_1.query.Lambda("newPrivilege", faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select("resource", faunadb_1.query.Var("privilege"), -1), faunadb_1.query.Select("resource", faunadb_1.query.Var("newPrivilege"), -1)))))
            }, faunadb_1.query.If(faunadb_1.query.IsEmpty(faunadb_1.query.Var("checks")), true, faunadb_1.query.And(faunadb_1.query.Var("checks")))))),
            filteredMembership: faunadb_1.query.Filter(faunadb_1.query.Var("membershipArray"), faunadb_1.query.Lambda("membership", faunadb_1.query.Let({
                checks: faunadb_1.query.Map(membership, faunadb_1.query.Lambda("newMembership", faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select("resource", faunadb_1.query.Var("membership"), -1), faunadb_1.query.Select("resource", faunadb_1.query.Var("newMembership"), -1)))))
            }, faunadb_1.query.If(faunadb_1.query.IsEmpty(faunadb_1.query.Var("checks")), true, faunadb_1.query.And(faunadb_1.query.Var("checks"))))))
        }, faunadb_1.query.Update(faunadb_1.query.Role(definition.name), {
            name: definition.name,
            membership: faunadb_1.query.Distinct(faunadb_1.query.Union(faunadb_1.query.Var("filteredMembership"), definition.membership || [])),
            privileges: faunadb_1.query.Distinct(faunadb_1.query.Union(faunadb_1.query.Var("filteredPrivileges"), definition.privileges || []))
        }));
    },
    token: function tokenUpdate(id, options) {
        return faunadb_1.query.Update(faunadb_1.query.Ref(faunadb_1.query.Tokens(), id), options);
    },
    key: function keyUpdate(id, options) {
        return faunadb_1.query.Update(faunadb_1.query.Ref(faunadb_1.query.Keys(), id), options);
    }
};
//# sourceMappingURL=update.js.map