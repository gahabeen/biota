"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const faunadb_1 = require("faunadb");
const index_1 = require("./lib/api/index");
class DB {
    constructor({ secret }) {
        this.q = faunadb_1.query;
        // console.log('set up with secret', secret)
        this.client = new fauna.Client({ secret });
        this.query = async function query(fqlQuery) {
            // console.log('query')
            const resolver = (fql) => Object.entries(fql).reduce((resolved, [key, value]) => {
                if (value) {
                    if (Array.isArray(value)) {
                        resolved[key] = value.map(resolver);
                    }
                    else if (typeof value === 'object') {
                        let symbols = Object.getOwnPropertySymbols(value).map((a) => a.toString());
                        let hasFQLWrapper = symbols.includes('Symbol(FQLWrapper)');
                        let hasDBCollection = symbols.includes('Symbol(DBCollection)');
                        if (hasFQLWrapper) {
                            resolved[key] = value.fql;
                        }
                        else if (hasDBCollection) {
                            try {
                                resolved[key] = value.list().fql;
                            }
                            catch (error) {
                                console.error(error);
                            }
                        }
                        else {
                            resolved[key] = resolver(value);
                        }
                    }
                    else {
                        resolved[key] = value;
                    }
                }
                else {
                    resolved[key] = value;
                }
                return resolved;
            }, {});
            let resolvedQuery = resolver(fqlQuery);
            return this.client.query(resolvedQuery);
        };
        this.fql = function fql(fqlQuery, options) {
            const { then = (res) => res } = options || {};
            const self = this;
            return {
                [Symbol('FQLWrapper')]: true,
                then,
                fql: fqlQuery,
                query: function () {
                    return self.client.query(fqlQuery); //.then(then)
                }
            };
        };
        this.login = async function login(id, password) {
            try {
                const loggedin = await this.collection('users')
                    .login(password, id)
                    .query();
                return new DB({ secret: loggedin.secret });
            }
            catch (e) {
                console.error(e);
            }
        };
        function bindThis(self, rootKey) {
            const resolver = (value) => {
                let entries = Object.entries(value);
                for (let [key, entry] of entries) {
                    if (typeof entry === 'object') {
                        value[key] = resolver(entry);
                    }
                    else if (typeof entry === 'function') {
                        value[key] = entry.bind(self);
                    }
                    else {
                        value[key] = entry;
                    }
                }
            };
            resolver(self[rootKey] || {});
        }
        this.collection = index_1.collection.bind(this);
        this.scaffold = index_1.scaffold;
        bindThis(this, 'scaffold');
        this.create = index_1.create;
        bindThis(this, 'create');
        this.update = index_1.update;
        bindThis(this, 'update');
        this.upsert = index_1.upsert;
        bindThis(this, 'upsert');
        this.replace = index_1.replace;
        bindThis(this, 'replace');
        this.forget = index_1.forget;
        bindThis(this, 'forget');
        this.me = index_1.me;
        bindThis(this, 'me');
        // this.create = {
        //   collection: create.collection.bind(this),
        //   index: create.index.bind(this),
        //   function: create.function.bind(this),
        //   role: create.role.bind(this)
        // }
        // this.update = {
        //   collection: update.collection.bind(this),
        //   index: update.index.bind(this),
        //   function: update.function.bind(this),
        //   role: update.role.bind(this)
        // }
        // this.upsert = {
        //   collection: upsert.collection.bind(this),
        //   index: upsert.index.bind(this),
        //   function: upsert.function.bind(this),
        //   role: upsert.role.bind(this)
        // }
        // this.replace = {
        //   collection: replace.collection.bind(this),
        //   index: replace.index.bind(this),
        //   function: replace.function.bind(this),
        //   role: replace.role.bind(this)
        // }
        // this.forget = {
        //   collection: forget.collection.bind(this),
        //   index: forget.index.bind(this),
        //   function: forget.function.bind(this),
        //   role: forget.role.bind(this)
        // }
        // this.me = {
        //   logout: me.logout.bind(this),
        //   changePassword: me.changePassword.bind(this),
        //   get: me.get.bind(this),
        //   update: me.update.bind(this),
        //   upsert: me.upsert.bind(this),
        //   delete: me.delete.bind(this),
        //   forget: me.forget.bind(this)
        // }
        this.collections = index_1.get.collections.bind(this);
        this.indexes = index_1.get.indexes.bind(this);
        this.functions = index_1.get.functions.bind(this);
        this.roles = index_1.get.roles.bind(this);
        this.keys = index_1.get.keys.bind(this);
        this.credentials = index_1.get.credentials.bind(this);
    }
}
exports.DB = DB;
//# sourceMappingURL=index.js.map