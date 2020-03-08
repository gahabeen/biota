"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_1 = require("./action");
function CustomPrivilege(privilege) {
    let { resource, actions } = privilege || {};
    return {
        resource,
        actions
    };
}
exports.CustomPrivilege = CustomPrivilege;
function Privilege(privilege) {
    let { resource, actions = {} } = privilege || {};
    return {
        resource,
        actions: {
            create: action_1.CreateAction(actions.create),
            delete: action_1.DeleteAction(actions.delete),
            read: action_1.ReadAction(actions.read),
            write: action_1.WriteAction(actions.write),
            history_write: action_1.HistoryReadAction(actions.history_read),
            history_read: action_1.HistoryReadAction(actions.history_read),
            unrestricted_read: action_1.UnrestrictedReadAction(actions.unrestricted_read),
            call: action_1.CallAction(actions.call)
        }
    };
}
exports.Privilege = Privilege;
//# sourceMappingURL=privilege.js.map