"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
function client(secret) {
    return new fauna.Client({ secret });
}
exports.client = client;
//# sourceMappingURL=fauna.js.map