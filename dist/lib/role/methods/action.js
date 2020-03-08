"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = require("./../../rule/defaults");
const rule_1 = require("../../rule/methods/rule");
function Action(type) {
    switch (type) {
        case 'owner':
            return defaults_1.isOwner;
        case 'not_owner':
            return defaults_1.isNotOwner;
        case 'assignee':
            return defaults_1.isAssignee;
        case 'not_assignee':
            return defaults_1.isNotAssignee;
        case 'all':
            return defaults_1.all;
        case 'none':
            return defaults_1.none;
        default:
            return null;
    }
}
exports.Action = Action;
function CreateAction(type) {
    if (!Array.isArray(type))
        type = [type];
    return rule_1.Rules([type.map(Action), defaults_1.isActivityNotChanged, defaults_1.areRightsNotChanged]);
}
exports.CreateAction = CreateAction;
function DeleteAction(type) {
    if (!Array.isArray(type))
        type = [type];
    return type.map(Action);
}
exports.DeleteAction = DeleteAction;
function ReadAction(type) {
    if (!Array.isArray(type))
        type = [type];
    return type.map(Action);
}
exports.ReadAction = ReadAction;
function WriteAction(type) {
    if (!Array.isArray(type))
        type = [type];
    return rule_1.Rules([type.map(Action), defaults_1.isActivityNotChanged, defaults_1.areRightsNotChanged]);
}
exports.WriteAction = WriteAction;
function HistoryReadAction(type) {
    if (!Array.isArray(type))
        type = [type];
    return type.map(Action);
}
exports.HistoryReadAction = HistoryReadAction;
function HistoryWriteAction(type) {
    if (!Array.isArray(type))
        type = [type];
    return rule_1.Rules([type.map(Action), defaults_1.isActivityNotChanged, defaults_1.areRightsNotChanged]);
}
exports.HistoryWriteAction = HistoryWriteAction;
function UnrestrictedReadAction(type) {
    if (!Array.isArray(type))
        type = [type];
    return type.map(Action);
}
exports.UnrestrictedReadAction = UnrestrictedReadAction;
function CallAction(type) {
    if (!Array.isArray(type))
        type = [type];
    return rule_1.Rules([type.map(Action), defaults_1.isFirstArgumentIdentity, defaults_1.isActivityNotChanged, defaults_1.areRightsNotChanged]);
}
exports.CallAction = CallAction;
//# sourceMappingURL=action.js.map