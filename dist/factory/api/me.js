"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const collection_1 = require("~/factory/api/collection");
exports.me = {
    logout: function meLogout(everywhere) {
        return collection_1.collection("users").logout(everywhere);
    },
    changePassword: function meChangePassword(password) {
        return collection_1.collection("users").changePassword(password);
    },
    get: function meGet() {
        return collection_1.collection("users").get(faunadb_1.query.Select("id", faunadb_1.query.Identity()));
    },
    update: function meUpdate(data) {
        return collection_1.collection("users").update(faunadb_1.query.Select("id", faunadb_1.query.Identity()), data);
    },
    upsert: function meUpsert(data) {
        return collection_1.collection("users").upsert(faunadb_1.query.Select("id", faunadb_1.query.Identity()), data);
    },
    delete: function meDelete() {
        return collection_1.collection("users").delete(faunadb_1.query.Select("id", faunadb_1.query.Identity()));
    },
    forget: function meForget() {
        return collection_1.collection("users").forget(faunadb_1.query.Select("id", faunadb_1.query.Identity()));
    }
};
//# sourceMappingURL=me.js.map