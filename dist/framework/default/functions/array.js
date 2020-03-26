"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/api/udfunction");
exports.Reverse = udfunction_1.UDFunction({
    name: "Array.Reverse",
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["arr"], faunadb_1.query.Reduce(faunadb_1.query.Lambda(["reversed", "item"], faunadb_1.query.Prepend(faunadb_1.query.Var("item"), faunadb_1.query.Var("reversed"))), [], faunadb_1.query.Var("arr"))))
});
//# sourceMappingURL=array.js.map