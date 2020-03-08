"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const baseDefaults = require("./defaults/base");
// import { owner } from './templates/owner'
exports.defaults = { ...baseDefaults };
exports.templates = {};
__export(require("./methods/function"));
//# sourceMappingURL=index.js.map