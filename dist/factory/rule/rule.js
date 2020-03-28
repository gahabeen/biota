"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// External
const faunadb_1 = require("faunadb");
exports.runLambda = (inputs, lambda) => faunadb_1.query.Select(0, faunadb_1.query.Map([...inputs], lambda));
exports.everyLambda = lambdas => faunadb_1.query.And(lambdas.map(lambda => exports.runLambda([faunadb_1.query.Var("doc")], lambda)));
function RuleBuilder(rule) {
    return (...args) => (rule || {}).query(...args);
    // return (...args: Expr[]) => ((rule || {}).lambda as Fn<Expr>)(...args)
}
exports.RuleBuilder = RuleBuilder;
function Rule(rule) {
    return (rule || {}).query;
    // return (rule || {}).lambda
}
exports.Rule = Rule;
function Rules(rules) {
    // return rules //.map((rule) => (rule || {}).query)
    // return everyLambda(rules.map((rule) => (rule || {}).lambda))
    if (rules.length > 1) {
        return faunadb_1.query.And(...rules);
    }
    else {
        return rules[0];
    }
}
exports.Rules = Rules;
//# sourceMappingURL=rule.js.map