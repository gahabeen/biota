"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const functions = require("./../function");
const language = require("../language/methods");
function collection(name = undefined) {
    return {
        [Symbol('DBCollection')]: true,
        list: function collectionList() {
            return faunadb_1.query.Paginate(faunadb_1.query.Documents(faunadb_1.query.Collection(name)));
        },
        login: function collectionLogin(password, id) {
            return faunadb_1.query.Login(language.reference(id ? { collection: name, id } : faunadb_1.query.Identity()), { password });
        },
        logout: function collectionLogout(everywhere) {
            return faunadb_1.query.Logout(everywhere);
        },
        changePassword: function collectionChangePassword(password) {
            return faunadb_1.query.Call(functions.defaults.ChangePassword.name, [faunadb_1.query.Identity(), faunadb_1.query.Identity(), password]);
        },
        get: function collectionGet(id) {
            return faunadb_1.query.Get(faunadb_1.query.Ref(faunadb_1.query.Collection(name), id));
        },
        create: function collectionCreate(data, { id, credentials }) {
            return faunadb_1.query.Call(functions.defaults.Create.name, [faunadb_1.query.Identity(), language.reference({ collection: name, id }), { data, credentials }]);
        },
        update: function collectionUpdate(id, data) {
            return faunadb_1.query.Call(functions.defaults.Update.name, [faunadb_1.query.Identity(), language.reference({ collection: name, id }), { data }]);
        },
        upsert: function collectionUpsert(id, data) {
            return faunadb_1.query.If(faunadb_1.query.Exists(language.reference({ collection: name, id })), this.collection(name).update(id, data), this.collection(name).create(data, { id }));
        },
        delete: function collectionDelete(id) {
            return faunadb_1.query.Update(language.reference({ collection: name, id }), {});
        },
        forget: function collectionForget(id) {
            return faunadb_1.query.Delete(language.reference({ collection: name, id }));
        }
        // field() {},
        // index(options) {}
    };
}
exports.collection = collection;
//# sourceMappingURL=collection.js.map