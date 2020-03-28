"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const fauna = require("faunadb");
const q = fauna.query;
// biota
const rule_1 = require("~/factory/api/rule");
const rules_1 = require("~/framework/api/default/rules");
const wrapDoc_1 = require("~/framework/helpers/wrapDoc");
function Action(type) {
    switch (type) {
        case "self":
            return rules_1.is_self;
        case "owner":
            return rules_1.is_owner;
        case "not_owner":
            return rules_1.is_not_owner;
        case "assignee":
            return rules_1.is_assignee;
        case "not_assignee":
            return rules_1.is_not_assignee;
        case "all":
            return rules_1.all;
        case "none":
            return rules_1.none;
        default:
            return false;
    }
}
exports.Action = Action;
function processActions(actions, defaultActions = []) {
    if (!actions && defaultActions.length === 0)
        return false;
    if (!Array.isArray(actions)) {
        return [actions, ...defaultActions];
    }
    else {
        return [...actions, ...defaultActions];
    }
}
function prepareRules(actions) {
    return rule_1.Rules(actions.map(action => {
        if (typeof action === "string") {
            return Action(action);
        }
        else {
            return action;
        }
    }));
}
function ReadAction(actions) {
    actions = processActions(actions);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda("ref", wrapDoc_1.wrapDoc("ref", prepareRules(actions)));
}
exports.ReadAction = ReadAction;
function WriteAction(actions) {
    actions = processActions(actions, [
    // is_activity_not_changed,
    // are_rights_not_changed
    ]);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda(["oldDoc", "newDoc"], prepareRules(actions));
}
exports.WriteAction = WriteAction;
function CreateAction(actions) {
    if (actions) {
        actions = processActions(actions, [
        // is_activity_not_changed,
        // are_rights_not_changed
        ]);
        if (typeof actions === "boolean")
            return actions;
        return q.Lambda(["doc"], prepareRules(actions));
    }
    return false;
}
exports.CreateAction = CreateAction;
function DeleteAction(actions) {
    actions = processActions(actions);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda(["ref"], q.Let({ doc: q.Get(q.Var("ref")) }, prepareRules(actions)));
}
exports.DeleteAction = DeleteAction;
function HistoryReadAction(actions) {
    actions = processActions(actions);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda(["ref"], q.Let({ doc: q.Get(q.Var("ref")) }, prepareRules(actions)));
}
exports.HistoryReadAction = HistoryReadAction;
function HistoryWriteAction(actions) {
    actions = processActions(actions, [
    // is_activity_not_changed,
    // are_rights_not_changed
    ]);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda(["ref", "ts", "action", "doc"], prepareRules(actions));
}
exports.HistoryWriteAction = HistoryWriteAction;
function UnrestrictedReadAction(actions) {
    actions = processActions(actions);
    if (typeof actions === "boolean")
        return actions;
    return prepareRules(actions);
}
exports.UnrestrictedReadAction = UnrestrictedReadAction;
function CallAction(actions) {
    actions = processActions(actions, [
    // is_first_argument_identity
    // is_activity_not_changed,
    // are_rights_not_changed
    ]);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda("args", prepareRules(actions));
}
exports.CallAction = CallAction;
//# sourceMappingURL=action.js.map