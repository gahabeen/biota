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
function Privilege(privilege) {
    let { resource, actions = {} } = privilege || {};
    let processedActions = {
        create: faunadb_1.query.Query(action_1.CreateAction(actions.create)),
        delete: faunadb_1.query.Query(action_1.DeleteAction(actions.delete)),
        read: faunadb_1.query.Query(action_1.ReadAction(actions.read)),
        write: faunadb_1.query.Query(action_1.WriteAction(actions.write)),
        history_write: faunadb_1.query.Query(action_1.HistoryWriteAction(actions.history_read)),
        history_read: faunadb_1.query.Query(action_1.HistoryReadAction(actions.history_read)),
        unrestricted_read: faunadb_1.query.Query(action_1.UnrestrictedReadAction(actions.unrestricted_read)),
        call: faunadb_1.query.Query(action_1.CallAction(actions.call))
    };
    let filteredActions = {};
    for (let action in actions) {
        filteredActions[action] = processedActions[action];
    }
    let result = {
        resource,
        actions: filteredActions
    };
    return result;
}
exports.Privilege = Privilege;
//# sourceMappingURL=privilege.js.map