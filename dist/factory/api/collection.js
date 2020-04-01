"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const ql_1 = require("~/factory/api/ql");
function collection(name = undefined) {
    if (!name) {
        throw new Error(`biota.collection(name) - valid name is required`);
    }
    return {
        /**
         * Specific methods
         */
        login(id, password) {
            return faunadb_1.query.Login(ql_1.Reference({ collection: name, id }), {
                password
            });
        },
        changePassword(password, id = faunadb_1.query.Identity()) {
            return faunadb_1.query.Call("biota.ChangePassword", [ql_1.Identity(), id, password]);
        },
        /**
         * General methods
         */
        get(id) {
            return faunadb_1.query.Get(faunadb_1.query.Ref(faunadb_1.query.Collection(name), id));
        },
        insert(data, { id, password, credentials } = {}) {
            return faunadb_1.query.Call("biota.Insert", [
                ql_1.Identity(),
                ql_1.Reference({ collection: name, id }),
                { data, credentials: { ...credentials, password } }
            ]);
        },
        update(id, data) {
            return faunadb_1.query.Call("biota.Update", [
                ql_1.Identity(),
                ql_1.Reference({ collection: name, id }),
                { data }
            ]);
        },
        replace(id, data) {
            return faunadb_1.query.Call("biota.Replace", [
                ql_1.Identity(),
                ql_1.Reference({ collection: name, id }),
                { data }
            ]);
        },
        upsert(id, data) {
            return faunadb_1.query.If(faunadb_1.query.Exists(ql_1.Reference({ collection: name, id })), collection(name).update(id, data), collection(name).insert(data, { id }));
        },
        repsert(id, data) {
            return faunadb_1.query.If(faunadb_1.query.Exists(ql_1.Reference({ collection: name, id })), collection(name).replace(id, data), collection(name).insert(data, { id }));
        },
        delete(id) {
            return faunadb_1.query.Call("biota.Delete", [
                ql_1.Identity(),
                ql_1.Reference({ collection: name, id })
            ]);
        },
        forget(id) {
            return faunadb_1.query.Call("biota.Forget", [
                ql_1.Identity(),
                ql_1.Reference({ collection: name, id })
            ]);
        }
    };
}
exports.collection = collection;
//# sourceMappingURL=collection.js.map