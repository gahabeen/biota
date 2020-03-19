"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
const defaults_1 = require("./../../rule/defaults");
const rule_1 = require("../../rule/methods/rule");
function Action(type) {
    switch (type) {
        case 'owner':
            return defaults_1.is_owner;
        case 'not_owner':
            return defaults_1.is_not_owner;
        case 'assignee':
            return defaults_1.is_assignee;
        case 'not_assignee':
            return defaults_1.is_not_assignee;
        case 'all':
            return defaults_1.all;
        case 'none':
            return defaults_1.none;
        default:
            return false;
    }
}
exports.Action = Action;
function processActions(actions) {
    return rule_1.Rules(actions.map((action) => {
        if (typeof action === 'string') {
            return Action(action);
        }
        else {
            return action;
        }
    }));
}
function ReadAction(actions) {
    if (!Array.isArray(actions))
        actions = [actions];
    return q.Lambda(['ref'], q.Let({ doc: q.Get(q.Var('ref')) }, processActions(actions)));
}
exports.ReadAction = ReadAction;
function WriteAction(actions) {
    if (!Array.isArray(actions))
        actions = [actions];
    actions = [...actions, defaults_1.is_activity_not_changed, defaults_1.are_rights_not_changed];
    return q.Lambda(['oldDoc', 'newDoc'], processActions(actions));
}
exports.WriteAction = WriteAction;
function CreateAction(actions) {
    if (!Array.isArray(actions))
        actions = [actions];
    actions = [...actions, defaults_1.is_activity_not_changed, defaults_1.are_rights_not_changed];
    return q.Lambda(['doc'], processActions(actions));
}
exports.CreateAction = CreateAction;
function DeleteAction(actions) {
    if (!Array.isArray(actions))
        actions = [actions];
    return q.Lambda(['ref'], q.Let({ doc: q.Get(q.Var('ref')) }, processActions(actions)));
}
exports.DeleteAction = DeleteAction;
function HistoryReadAction(actions) {
    if (!Array.isArray(actions))
        actions = [actions];
    return q.Lambda(['ref'], q.Let({ doc: q.Get(q.Var('ref')) }, processActions(actions)));
}
exports.HistoryReadAction = HistoryReadAction;
function HistoryWriteAction(actions) {
    if (!Array.isArray(actions))
        actions = [actions];
    actions = [...actions, defaults_1.is_activity_not_changed, defaults_1.are_rights_not_changed];
    return q.Lambda(['ref', 'ts', 'action', 'doc'], processActions(actions));
}
exports.HistoryWriteAction = HistoryWriteAction;
function UnrestrictedReadAction(actions) {
    if (!Array.isArray(actions))
        actions = [actions];
    return false; // UPDATE!
}
exports.UnrestrictedReadAction = UnrestrictedReadAction;
function CallAction(actions) {
    if (!Array.isArray(actions))
        actions = [actions];
    actions = [...actions, defaults_1.is_first_argument_identity, defaults_1.is_activity_not_changed, defaults_1.are_rights_not_changed];
    return q.Lambda(['args'], processActions(actions));
}
exports.CallAction = CallAction;
//# sourceMappingURL=action.js.map