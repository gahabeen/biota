"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Privilege(privilege) {
    let { resource, actions } = privilege || {};
    return {
        resource,
        actions
    };
}
exports.Privilege = Privilege;
//# sourceMappingURL=privilege.js.map