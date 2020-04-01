"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
function wrapDoc(refVar, fql) {
    return faunadb_1.query.Let({
        doc: faunadb_1.query.Get(faunadb_1.query.Var(refVar))
    }, fql);
}
exports.wrapDoc = wrapDoc;
//# sourceMappingURL=wrapDoc.js.map