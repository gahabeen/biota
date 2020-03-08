"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
function Cursor(pathArray) {
    return faunadb_1.query.Query(faunadb_1.query.Lambda('doc', faunadb_1.query.Select(pathArray, faunadb_1.query.Var('doc'), Infinity)));
}
exports.Cursor = Cursor;
function ToCursor(index) {
    const { name, source = {}, terms = [] } = index || {};
    // const { fields } = source
    let pathArray;
    try {
        pathArray = terms[0].field;
    }
    catch (error) {
        pathArray = undefined;
    }
    if (pathArray) {
        return {
            name,
            source: {
                ...source,
                fields: {
                    cursor: Cursor(pathArray)
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        };
    }
    else {
        return undefined;
    }
}
exports.ToCursor = ToCursor;
//# sourceMappingURL=cursor.js.map