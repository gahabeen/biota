"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ql = require("./api/ql");
// by class
var collection_1 = require("./api/collection");
exports.collection = collection_1.collection;
// export { database } from "./api/database";
// crud
var get_1 = require("./api/get");
exports.get = get_1.get;
var create_1 = require("./api/create");
exports.create = create_1.create;
var update_1 = require("./api/update");
exports.update = update_1.update;
var upsert_1 = require("./api/upsert");
exports.upsert = upsert_1.upsert;
var repsert_1 = require("./api/repsert");
exports.repsert = repsert_1.repsert;
var replace_1 = require("./api/replace");
exports.replace = replace_1.replace;
var forget_1 = require("./api/forget");
exports.forget = forget_1.forget;
//# sourceMappingURL=index.js.map