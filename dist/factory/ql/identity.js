"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const fauna = require("faunadb");
const q = fauna.query;
function Identity() {
    return q.If(q.HasIdentity(), q.Identity(), null);
}
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map