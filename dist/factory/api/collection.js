"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const ql_1 = require("~/factory/api/ql");
__export(require("../collection/wrapper"));
function collection(name = undefined) {
    if (!name) {
        throw new Error(`biota.collection(name) - valid name is required`);
    }
    return {
        list: function collectionList() {
            return faunadb_1.query.Paginate(faunadb_1.query.Documents(faunadb_1.query.Collection(name)));
        },
        login: function collectionLogin(id, password) {
            return faunadb_1.query.Login(ql_1.Reference({ collection: name, id }), {
                password
            });
        },
        logout: function collectionLogout(everywhere) {
            return faunadb_1.query.Logout(everywhere);
        },
        changePassword: function collectionChangePassword(password) {
            return faunadb_1.query.Call("biota.ChangePassword", [
                faunadb_1.query.Identity(),
                faunadb_1.query.Identity(),
                password
            ]);
        },
        get: function collectionGet(id) {
            return faunadb_1.query.Get(faunadb_1.query.Ref(faunadb_1.query.Collection(name), id));
        },
        create: function collectionCreate(data, { id, password } = {}) {
            return faunadb_1.query.Call("biota.Create", [
                faunadb_1.query.Identity(),
                ql_1.Reference({ collection: name, id }),
                { data, credentials: { password } }
            ]);
        },
        update: function collectionUpdate(id, data) {
            return faunadb_1.query.Call("biota.Update", [
                faunadb_1.query.Identity(),
                ql_1.Reference({ collection: name, id }),
                { data }
            ]);
        },
        upsert: function collectionUpsert(id, data) {
            return faunadb_1.query.If(faunadb_1.query.Exists(ql_1.Reference({ collection: name, id })), collection(name).update(id, data), collection(name).create(data, { id }));
        },
        delete: function collectionDelete(id) {
            return faunadb_1.query.Update(ql_1.Reference({ collection: name, id }), {});
        },
        forget: function collectionForget(id) {
            return faunadb_1.query.Delete(ql_1.Reference({ collection: name, id }));
        }
    };
}
exports.collection = collection;
//# sourceMappingURL=collection.js.map