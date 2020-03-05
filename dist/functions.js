"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
exports.changePassword = {
    name: 'ChangePassword',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['ref', 'password'], faunadb_1.query.Update(faunadb_1.query.Var('ref'), {
        credentials: {
            password: faunadb_1.query.Var('password')
        }
    })))
};
//# sourceMappingURL=functions.js.map