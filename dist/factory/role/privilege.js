"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const action_1 = require("./action");
function CustomPrivilege(privilege) {
    let { resource, actions } = privilege || {};
    return {
        resource,
        actions
    };
}
exports.CustomPrivilege = CustomPrivilege;
function QueryWrapper(expr) {
    if (typeof expr === "boolean") {
        return expr;
    }
    else {
        return faunadb_1.query.Query(expr);
    }
}
function Privilege(privilege) {
    let { resource, actions = {} } = privilege || {};
    let processedActions = {
        create: QueryWrapper(action_1.CreateAction(actions.create)),
        delete: QueryWrapper(action_1.DeleteAction(actions.delete)),
        read: QueryWrapper(action_1.ReadAction(actions.read)),
        write: QueryWrapper(action_1.WriteAction(actions.write)),
        history_write: QueryWrapper(action_1.HistoryWriteAction(actions.history_read)),
        history_read: QueryWrapper(action_1.HistoryReadAction(actions.history_read)),
        unrestricted_read: QueryWrapper(action_1.UnrestrictedReadAction(actions.unrestricted_read)),
        call: QueryWrapper(action_1.CallAction(actions.call))
    };
    let filteredActions = {};
    for (let action in actions) {
        filteredActions[action] = processedActions[action];
    }
    // console.log("filteredActions", resource, filteredActions);
    let result = {
        resource,
        actions: filteredActions
    };
    return result;
}
exports.Privilege = Privilege;
//# sourceMappingURL=privilege.js.map