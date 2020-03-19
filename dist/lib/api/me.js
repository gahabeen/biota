"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
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
//# sourceMappingURL=me.js.map