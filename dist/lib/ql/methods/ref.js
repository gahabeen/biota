"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
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
//# sourceMappingURL=ref.js.map