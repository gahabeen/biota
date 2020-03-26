"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Role(role) {
    let { name, membership, privileges } = role || {};
    let self = {
        name,
        membership,
        privileges: privileges || [],
        setMembership(newMembership) {
            return Role({ name, privileges, membership: newMembership });
        },
        addPrivilege(newPrivilege) {
            return Role({ name, privileges: [...privileges.filter((p) => p.resource !== newPrivilege.resource), newPrivilege], membership });
        }
    };
    return self;
}
exports.Role = Role;
//# sourceMappingURL=wrapper.js.map