"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const functions = require("./../function");
const language = require("../language/methods");
exports.scaffold = {
    collections: {
        users() {
            return this.fql();
        },
        activities() {
            return this.fql();
        }
    },
    indexes: {
        for(name) {
            return this.fql();
        }
    },
    functions: {
        for(name) {
            return this.fql();
        }
    },
    roles: {
        for(name) {
            return this.fql();
        }
    }
};
exports.get = {
    collections: function collectionsGet() {
        return this.fql(faunadb_1.query.Paginate(faunadb_1.query.Collections(), {}));
    },
    indexes: function indexesGet() {
        return this.fql(faunadb_1.query.Paginate(faunadb_1.query.Indexes(), {}));
    },
    functions: function functionsGet() {
        return this.fql(faunadb_1.query.Paginate(faunadb_1.query.Functions(), {}));
    },
    roles: function rolesGet() {
        return this.fql(faunadb_1.query.Paginate(faunadb_1.query.Roles(), {}));
    },
    keys: function keysGet() {
        return this.fql(faunadb_1.query.Paginate(faunadb_1.query.Keys()));
    },
    credentials: function credentialsGet() {
        return this.fql(faunadb_1.query.Paginate(faunadb_1.query.Documents(faunadb_1.query.Credentials())));
    }
};
exports.create = {
    collection: function collectionCreate(name, opts) {
        return this.fql(faunadb_1.query.CreateCollection({
            name
        }));
    },
    index: function indexCreate(name, opts) {
        return this.fql(faunadb_1.query.CreateIndex({
            name
        }));
    },
    function: function functionCreate(name, opts) {
        return this.fql(faunadb_1.query.CreateFunction({
            name
        }));
    },
    role: function roleCreate(name, opts) {
        return this.fql(faunadb_1.query.CreateRole({
            name
        }));
    }
};
exports.update = {
    collection: function collectionUpdate(name, opts) {
        return this.fql(faunadb_1.query.Update(faunadb_1.query.Collection(name), {}));
    },
    index: function indexUpdate(name, opts) {
        return this.fql(faunadb_1.query.Update(faunadb_1.query.Index(name), {}));
    },
    function: function functionUpdate(name, opts) {
        return this.fql(faunadb_1.query.Update(faunadb_1.query.Function(name), {}));
    },
    role: function roleUpdate(name, opts) {
        return this.fql(faunadb_1.query.Update(faunadb_1.query.Role(name), {}));
    }
};
exports.upsert = {
    collection: function collectionUpsert(name) {
        return this.fql(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Collection(name)), exports.update.collection(name, {}), exports.create.collection(name, {})));
    },
    index: function indexUpsert(name) {
        return this.fql(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Index(name)), exports.update.index(name, {}), exports.create.index(name, {})));
    },
    function: function functionUpsert(name) {
        return this.fql(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Function(name)), exports.update.function(name, {}), exports.create.function(name, {})));
    },
    role: function roleUpsert(name) {
        return this.fql(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Role(name)), exports.update.role(name, {}), exports.create.role(name, {})));
    }
};
exports.replace = {
    collection: function collectionReplace(name, opts) {
        return this.fql(faunadb_1.query.Replace(faunadb_1.query.Collection(name), {}));
    },
    index: function indexReplace(name, opts) {
        return this.fql(faunadb_1.query.Replace(faunadb_1.query.Index(name), {}));
    },
    function: function fuctionReplace(name, opts) {
        return this.fql(faunadb_1.query.Replace(faunadb_1.query.Function(name), {}));
    },
    role: function roleReplace(name, opts) {
        return this.fql(faunadb_1.query.Replace(faunadb_1.query.Role(name), {}));
    }
};
exports.forget = {
    collection: function collectionForget(name) {
        return this.fql(faunadb_1.query.Delete(faunadb_1.query.Collection(name)));
    },
    index: function indexForget(name) {
        return this.fql(faunadb_1.query.Delete(faunadb_1.query.Index(name)));
    },
    function: function functionForget(name) {
        return this.fql(faunadb_1.query.Delete(faunadb_1.query.Function(name)));
    },
    role: function roleForget(name) {
        return this.fql(faunadb_1.query.Delete(faunadb_1.query.Role(name)));
    }
};
function collection(name = undefined) {
    let self = this;
    return {
        [Symbol('DBCollection')]: true,
        list: function collectionList() {
            return self.fql(faunadb_1.query.Paginate(faunadb_1.query.Documents(faunadb_1.query.Collection(name))));
        },
        login: function collectionLogin(password, id) {
            return self.fql(faunadb_1.query.Login(language.reference(id ? { collection: name, id } : faunadb_1.query.Identity()), { password }));
        },
        logout: function collectionLogout(everywhere) {
            return self.fql(faunadb_1.query.Logout(everywhere));
        },
        changePassword: function collectionChangePassword(password) {
            return self.fql(faunadb_1.query.Call(functions.defaults.ChangePassword.name, [faunadb_1.query.Identity(), faunadb_1.query.Identity(), password]));
        },
        get: function collectionGet(id) {
            return self.fql(faunadb_1.query.Get(faunadb_1.query.Ref(faunadb_1.query.Collection(name), id)));
        },
        create: function collectionCreate(data, { id, credentials }) {
            return self.fql(faunadb_1.query.Call(functions.defaults.Create.name, [faunadb_1.query.Identity(), language.reference({ collection: name, id }), { data, credentials }]));
        },
        update: function collectionUpdate(id, data) {
            return self.fql(faunadb_1.query.Call(functions.defaults.Update.name, [faunadb_1.query.Identity(), language.reference({ collection: name, id }), { data }]));
        },
        upsert: function collectionUpsert(id, data) {
            return self.fql(faunadb_1.query.If(faunadb_1.query.Exists(language.reference({ collection: name, id })), collection(name).update(id, data), collection(name).create(data, { id })));
        },
        delete: function collectionDelete(id) {
            return self.fql(faunadb_1.query.Update(language.reference({ collection: name, id }), {}));
        },
        forget: function collectionForget(id) {
            return self.fql(faunadb_1.query.Delete(language.reference({ collection: name, id })));
        }
        // field() {},
        // index(opts) {}
    };
}
exports.collection = collection;
exports.me = {
    logout: function meLogout(everywhere) {
        return this.collection('users').logout(everywhere);
    },
    changePassword: function meChangePassword(password) {
        return this.collection('users').changePassword(password);
    },
    get: function meGet() {
        return this.collection('users').get(faunadb_1.query.Select('id', faunadb_1.query.Identity()));
    },
    update: function meUpdate(data) {
        return this.collection('users').update(faunadb_1.query.Select('id', faunadb_1.query.Identity()), data);
    },
    upsert: function meUpsert(data) {
        return this.collection('users').upsert(faunadb_1.query.Select('id', faunadb_1.query.Identity()), data);
    },
    delete: function meDelete() {
        return this.collection('users').delete(faunadb_1.query.Select('id', faunadb_1.query.Identity()));
    },
    forget: function meForget() {
        return this.collection('users').forget(faunadb_1.query.Select('id', faunadb_1.query.Identity()));
    }
};
//# sourceMappingURL=index.js.map