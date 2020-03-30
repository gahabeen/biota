"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const fauna = require("faunadb");
// biota
const framework = require("~/framework");
const factory = require("~/factory");
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
    constructor({ secret }) {
        this.client = new fauna.Client({ secret });
        this.query = framework.query.bind(this);
        this.paginate = framework.paginate.bind(this);
        this.login = framework.login.bind(this);
        this.relation = framework.relation.bind(this);
        this.execute = tasks_1.execute.bind(this);
        this.foundation = framework.foundation.bind(this);
        this.collection = framework.collection.bind(this);
        bindThis(this, "collection");
        this.document = framework.document.bind(this);
        bindThis(this, "collection");
        this.factory = factory;
        bindThis(this, "factory");
        this.framework = framework;
        bindThis(this, "framework");
        // this.create = framework.create.bind(this)
        // bindThis(this, "collection")
        // this.scaffold = scaffold;
        // bindThis(this, "scaffold");
        // this.create = api.create;
        // bindThis(this, "create");
        // this.update = api.update;
        // bindThis(this, "update");
        // this.upsert = api.upsert;
        // bindThis(this, "upsert");
        // this.replace = api.replace;
        // bindThis(this, "replace");
        // this.forget = api.forget;
        // bindThis(this, "forget");
        // this.me = api.me;
        // bindThis(this, "me");
        // this.get = api.get.get.bind(this);
        // this.collections = api.get.collections.bind(this);
        // this.indexes = api.get.indexes.bind(this);
        // this.functions = api.get.functions.bind(this);
        // this.roles = api.get.roles.bind(this);
        // this.keys = api.get.keys.bind(this);
        // this.tokens = api.get.tokens.bind(this);
        // this.credentials = api.get.credentials.bind(this);
    }
}
exports.DB = DB;
//# sourceMappingURL=db.js.map