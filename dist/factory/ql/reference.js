"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const fauna = require("faunadb");
const q = fauna.query;
function Reference({ collection, id, ref } = {}) {
    return ref ? ref : id ? q.Ref(q.Collection(collection), id) : q.Collection(collection);
}
exports.Reference = Reference;
function Ref(collectionOrRef, id) {
    if (typeof collectionOrRef === 'string') {
        const [collection, withId] = collectionOrRef.split('/');
        return q.Ref(q.Collection(collection), withId);
    }
    else {
        return q.Ref(collectionOrRef);
    }
}
exports.Ref = Ref;
//# sourceMappingURL=reference.js.map