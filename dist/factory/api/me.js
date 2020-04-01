"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const collection_1 = require("~/factory/api/collection");
exports.me = {
    logout(everywhere) {
        return faunadb_1.query.Logout(everywhere);
    },
    changePassword(password) {
        return collection_1.collection("users").changePassword(password);
    },
    get() {
        return collection_1.collection("users").get(faunadb_1.query.Select("id", faunadb_1.query.Identity()));
    },
    update(data) {
        return collection_1.collection("users").update(faunadb_1.query.Select("id", faunadb_1.query.Identity()), data);
    },
    upsert(data) {
        return collection_1.collection("users").upsert(faunadb_1.query.Select("id", faunadb_1.query.Identity()), data);
    },
    delete() {
        return collection_1.collection("users").delete(faunadb_1.query.Select("id", faunadb_1.query.Identity()));
    },
    forget() {
        return collection_1.collection("users").forget(faunadb_1.query.Select("id", faunadb_1.query.Identity()));
    }
};
//# sourceMappingURL=me.js.map