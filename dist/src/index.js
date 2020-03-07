"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const fauna = require("./fauna");
const m = require("./methods");
const functions = require("./scaffold/functions");
const types_1 = require("./types");
function DB({ secret }) {
    const client = fauna.client(secret);
    let db = {
        q: faunadb_1.query,
        client,
        query: (fqlQuery) => {
            const resolver = (fql) => Object.entries(fql).reduce((resolved, [key, value]) => {
                if (Array.isArray(value)) {
                    resolved[key] = value.map(resolver);
                }
                else if (typeof value === 'object') {
                    if (value[Symbol('FQLWrapper')]) {
                        resolved[key] = value.fql;
                    }
                    else {
                        resolved[key] = resolver(value);
                    }
                }
                return resolved;
            }, fql);
            return client.query.call(client, resolver(fqlQuery));
        },
        fql: (fqlQuery) => ({
            [Symbol('FQLWrapper')]: true,
            fql: fqlQuery,
            query: function () {
                return client.query(this.fql);
            }
        })
    };
    const scaffold = async () => { };
    const get = {
        async collections() {
            return db.fql(faunadb_1.query.Paginate(faunadb_1.query.Collections(), {}));
        },
        async indexes() {
            return db.fql(faunadb_1.query.Paginate(faunadb_1.query.Indexes(), {}));
        },
        async functions() {
            return db.fql(faunadb_1.query.Paginate(faunadb_1.query.Functions(), {}));
        },
        async roles() {
            return db.fql(faunadb_1.query.Paginate(faunadb_1.query.Roles(), {}));
        },
        async keys() {
            return db.fql(faunadb_1.query.Paginate(faunadb_1.query.Keys()));
        }
    };
    const create = {
        collection(name, opts) {
            return db.fql(faunadb_1.query.CreateCollection({
                name
            }));
        },
        index(name, opts) {
            return db.fql(faunadb_1.query.CreateIndex({
                name
            }));
        },
        function(name, opts) {
            return db.fql(faunadb_1.query.CreateFunction({
                name
            }));
        },
        role(name, opts) {
            return db.fql(faunadb_1.query.CreateRole({
                name
            }));
        }
    };
    const update = {
        collection(name, opts) {
            return db.fql(faunadb_1.query.Update(faunadb_1.query.Collection(name), {}));
        },
        index(name, opts) {
            return db.fql(faunadb_1.query.Update(faunadb_1.query.Index(name), {}));
        },
        function(name, opts) {
            return db.fql(faunadb_1.query.Update(faunadb_1.query.Function(name), {}));
        },
        role(name, opts) {
            return db.fql(faunadb_1.query.Update(faunadb_1.query.Role(name), {}));
        }
    };
    const upsert = {
        collection(name) {
            return db.fql(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Collection(name)), update.collection(name, {}), create.collection(name, {})));
        },
        index(name) {
            return db.fql(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Index(name)), update.index(name, {}), create.index(name, {})));
        },
        function(name) {
            return db.fql(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Function(name)), update.function(name, {}), create.function(name, {})));
        },
        role(name) {
            return db.fql(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Role(name)), update.role(name, {}), create.role(name, {})));
        }
    };
    const replace = {
        collection(name, opts) {
            return db.fql(faunadb_1.query.Replace(faunadb_1.query.Collection(name), {}));
        },
        index(name, opts) {
            return db.fql(faunadb_1.query.Replace(faunadb_1.query.Index(name), {}));
        },
        function(name, opts) {
            return db.fql(faunadb_1.query.Replace(faunadb_1.query.Function(name), {}));
        },
        role(name, opts) {
            return db.fql(faunadb_1.query.Replace(faunadb_1.query.Role(name), {}));
        }
    };
    const forget = {
        collection(name) {
            return db.fql(faunadb_1.query.Delete(faunadb_1.query.Collection(name)));
        },
        index(name) {
            return db.fql(faunadb_1.query.Delete(faunadb_1.query.Index(name)));
        },
        function(name) {
            return db.fql(faunadb_1.query.Delete(faunadb_1.query.Function(name)));
        },
        role(name) {
            return db.fql(faunadb_1.query.Delete(faunadb_1.query.Role(name)));
        }
    };
    const collection = (name) => {
        return {
            async login(password) {
                return db.fql(faunadb_1.query.Login(faunadb_1.query.Identity(), { password }));
            },
            async logout(everywhere) {
                return db.fql(faunadb_1.query.Logout(everywhere));
            },
            async changePassword(password) {
                return db.fql(faunadb_1.query.Call(functions.ChangePassword.name, [faunadb_1.query.Identity(), faunadb_1.query.Identity(), password]));
            },
            async get(id) {
                return db.fql(faunadb_1.query.Get(faunadb_1.query.Ref(faunadb_1.query.Collection(collection), id)));
            },
            async create(data, { id, credentials }) {
                return db.fql(faunadb_1.query.Call(functions.Create.name, [faunadb_1.query.Identity(), m.reference({ collection: name, id }), { data, credentials }]));
            },
            async update(id, data) {
                return db.fql(faunadb_1.query.Call(functions.Update.name, [faunadb_1.query.Identity(), m.reference({ collection: name, id }), { data }]));
            },
            async upsert(id, data) {
                return db.fql(faunadb_1.query.If(faunadb_1.query.Exists(m.reference({ collection: name, id })), collection(name).update(id, data), collection(name).create(data, { id })));
            },
            async delete(id) {
                return db.fql(faunadb_1.query.Update(m.reference({ collection: name, id }), {}));
            },
            async forget() {
                return db.fql(faunadb_1.query.Delete(m.reference({ collection: name, id })));
            },
            batch: {
                async get() { },
                async create() { },
                async update() { },
                async upsert() { },
                async delete() { },
                async forget() { }
            },
            field() { },
            index(opts) { }
        };
    };
    return {
        ...db,
        scaffold,
        ...get,
        create,
        update,
        upsert,
        replace,
        forget,
        collection
    };
}
exports.DB = DB;
const db = types_1.DB({ secret: '123' });
// init
db.scaffold();
// create collection
// db.create.function('users', {})
// db.create.index('users', {})
// db.create.role('users', {})
// db.create.database('users')
db.create.collection('users');
// db.udpate
// db.delete
// unique field
db.collection('users').field({
    field: 'data.profile.email',
    unique: true
});
// 1-to-1 relationship (one user can have one company and inverse)
db.collection('users').field({
    field: 'data.company',
    relation: db.collection('companies').field({ field: 'ref', one: true }),
    one: true
});
// 1-to-many relationship (one company can have several users and inverse)
db.collection('users').field({
    field: 'data.company',
    relation: db.collection('companies').field({ field: 'ref', one: true }),
    many: true
});
// create
db.collection('users').create({
    profile: {
        email: 'desserprit.gabin@gmail.com'
    },
    // company: db.collection("companies").connect(1234)
    company: db.collection('companies').create({
        name: 'Super ça'
    })
});
db.collection('users').index({ 'term:data.profile.email': '' });
db.collection('users').get(123);
db.collection('users').get({ 'term:data.profile.email': '', size: 3, after: 'cursor' });
//# sourceMappingURL=index.js.map