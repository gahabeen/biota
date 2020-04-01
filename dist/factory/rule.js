"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// External
const faunadb_1 = require("faunadb");
function RuleBuilder(rule) {
    return (...args) => (rule || {}).query(...args);
}
exports.RuleBuilder = RuleBuilder;
function Rule(rule) {
    return (rule || {}).query;
    // return (rule || {}).lambda
}
exports.Rule = Rule;
function Rules(rules) {
    if (rules.length > 1) {
        return faunadb_1.query.And(...rules);
    }
    else {
        return rules[0];
    }
}
exports.Rules = Rules;
//# sourceMappingURL=rule.js.map