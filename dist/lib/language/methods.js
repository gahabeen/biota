"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
function reference({ collection, id, ref } = {}) {
    return ref ? ref : id ? q.Ref(q.Collection(collection), id) : q.Collection(collection);
}
exports.reference = reference;
//# sourceMappingURL=methods.js.map