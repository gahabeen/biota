"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
exports.runLambda = (inputs, lambda) => faunadb_1.query.Select(0, faunadb_1.query.Map([...inputs], lambda));
exports.everyLambda = (lambdas) => faunadb_1.query.And(lambdas.map((lambda) => exports.runLambda([faunadb_1.query.Var('doc')], lambda)));
function RuleBuilder(rule) {
    return (...args) => rule.lambda(...args);
}
exports.RuleBuilder = RuleBuilder;
function Rule(rule) {
    return rule.lambda;
}
exports.Rule = Rule;
function Rules(rules) {
    return exports.everyLambda(rules.map((rule) => rule.lambda));
}
exports.Rules = Rules;
//# sourceMappingURL=rule.js.map