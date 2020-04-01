"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("~/consts");
__export(require("../role/action"));
__export(require("../role/privilege"));
function roleNameNormalized(name) {
    return `${consts_1.CONVENTION.ROLE_PREFIX}${name.replace(consts_1.CONVENTION.ROLE_PREFIX, "")}`;
}
exports.roleNameNormalized = roleNameNormalized;
function Role(role) {
    let { name, membership, privileges } = role || {};
    let self = {
        name,
        membership,
        privileges: privileges || []
    };
    return self;
}
exports.Role = Role;
//# sourceMappingURL=role.js.map