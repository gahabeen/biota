"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const indexes__by__terms_1 = require("./defaults/indexes__by__terms");
const ownerTemplates = require("./templates/owner");
const accessTemplates = require("./templates/access");
const activityTemplates = require("./templates/activity");
const assigneesTemplates = require("./templates/assignees");
exports.defaults = { indexes__by__terms: indexes__by__terms_1.indexes__by__terms };
exports.templates = { ...ownerTemplates, ...accessTemplates, ...activityTemplates, ...assigneesTemplates };
__export(require("./methods/cursor"));
__export(require("./methods/index"));
__export(require("./methods/reverse"));
//# sourceMappingURL=index.js.map