"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const faunadb_1 = require("faunadb");
const ql = require("./lib/ql");
const index_1 = require("./lib/api/index");
const logger_1 = require("./lib/logger");
const delay_1 = require("delay");
class DB {
    constructor({ secret }) {
        this.q = faunadb_1.query;
        this.ql = ql;
        // console.log('set up with secret', secret)
        this.client = new fauna.Client({ secret });
        this.print = logger_1.printer;
        this.log = logger_1.logger;
        this.execute = logger_1.execute;
        this.steps = logger_1.steps;
        this.delay = delay_1.default;
        this.query = async function query(fqlQuery, description = '') {
            // this.print.title(`Query`, description)
            return this.client.query(fqlQuery);
            // .then((res) => {
            //   // this.print.success(res)
            //   // this.print.result(res)
            //   return res
            // })
            // .catch((err) => {
            //   // this.print.error('Failed', `${description} `)
            //   // this.print.error(err)
            //   // this.log.error(description, err)
            // })
        };
        // this.log = async (prom) =>
        //   prom
        //     .then((res) => {
        //       console.log(res)
        //       return res
        //     })
        //     .catch(console.error)
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
                return value;
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
        this.get = index_1.get.get.bind(this);
        this.collections = index_1.get.collections.bind(this);
        this.indexes = index_1.get.indexes.bind(this);
        this.functions = index_1.get.functions.bind(this);
        this.roles = index_1.get.roles.bind(this);
        this.keys = index_1.get.keys.bind(this);
        this.tokens = index_1.get.tokens.bind(this);
        this.credentials = index_1.get.credentials.bind(this);
    }
}
exports.DB = DB;
//# sourceMappingURL=index.js.map