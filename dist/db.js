"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const fauna = require("faunadb");
const factory = require("~/factory");
const framework = require("~/framework");
const tasks_1 = require("~/tasks");
function bindThis(self, rootKey) {
    const resolver = value => {
        let entries = Object.entries(value);
        for (let [key, entry] of entries) {
            if (typeof entry === "object") {
                value[key] = resolver(entry);
            }
            else if (typeof entry === "function") {
                value[key] = entry.bind(self);
            }
            else {
                value[key] = entry;
            }
        }
        return value;
    };
    resolver(self[rootKey] || {});
}
class DB {
    constructor(options) {
        let { secret, debug } = options || {};
        const log = debug_1.default("biota");
        log.enabled = debug;
        this.client = new fauna.Client({ secret });
        this.query = framework.query.bind(this);
        this.paginate = framework.paginate.bind(this);
        this.login = framework.login.bind(this);
        this.relation = framework.relation.bind(this);
        this.execute = tasks_1.execute.bind(this);
        this.foundation = framework.foundation.bind(this);
        this.collection = framework.collection.bind(this);
        this.factory = factory;
        bindThis(this, "factory");
        this.framework = framework;
        bindThis(this, "framework");
    }
}
exports.DB = DB;
//# sourceMappingURL=db.js.map