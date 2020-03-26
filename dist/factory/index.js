"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = require("./api/database");
exports.index = require("./api/index");
exports.udfunction = require("./api/udfunction");
exports.role = require("./api/role");
exports.rule = require("./api/rule");
exports.ql = require("./api/ql");
// crud
var get_1 = require("./api/get");
exports.get = get_1.get;
var create_1 = require("./api/create");
exports.create = create_1.create;
var update_1 = require("./api/update");
exports.update = update_1.update;
var upsert_1 = require("./api/upsert");
exports.upsert = upsert_1.upsert;
var replace_1 = require("./api/replace");
exports.replace = replace_1.replace;
var forget_1 = require("./api/forget");
exports.forget = forget_1.forget;
var me_1 = require("./api/me");
exports.me = me_1.me;
//# sourceMappingURL=index.js.map