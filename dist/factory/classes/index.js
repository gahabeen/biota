"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
function indexNameNormalized(name) {
    return `biota.${name.replace("biota.", "")}`;
}
exports.indexNameNormalized = indexNameNormalized;
function Index(index) {
    let { name, source = {
        collection: undefined,
        fields: {}
    }, terms = [], values = [], unique = false, serialized = true, permissions = {}, data = {} } = index || {};
    let self = {
        name,
        source,
        terms,
        values,
        unique,
        serialized,
        permissions,
        data
    };
    return self;
}
exports.Index = Index;
function Cursor(pathArray) {
    return faunadb_1.query.Query(faunadb_1.query.Lambda("doc", faunadb_1.query.Select(pathArray, faunadb_1.query.Var("doc"), Infinity)));
}
exports.Cursor = Cursor;
function ToCursor(index) {
    const { name, source = {}, terms = [] } = index || {};
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
            values: [{ binding: "cursor" }, { field: ["ref"] }]
        };
    }
    else {
        return undefined;
    }
}
exports.ToCursor = ToCursor;
function ToReverse(index) {
    let { terms, data } = index || {};
    let [firstTerm = {}, ...otherTerms] = terms || [];
    firstTerm.reverse = true;
    return {
        ...index,
        name: `${index.name}__reverse`,
        terms: [firstTerm, ...otherTerms],
        data: { ...data, reverse: true }
    };
}
exports.ToReverse = ToReverse;
function NGramOnField(depth = 10, field) {
    return faunadb_1.query.Union(faunadb_1.query.Map(new Array(depth).fill(null).map((_, i) => i + 1), faunadb_1.query.Lambda("min", faunadb_1.query.NGram(faunadb_1.query.LowerCase(faunadb_1.query.Select(field, faunadb_1.query.Var("instance"))), faunadb_1.query.Var("min"), faunadb_1.query.Add(1, faunadb_1.query.Var("min"))))));
}
exports.NGramOnField = NGramOnField;
function SearchIndex(collection, depth = 10, fields) {
    return Index({
        name: `${collection}__search_on__${fields
            .map(field => field.join("_"))
            .join("_and_")}`,
        source: {
            collection: faunadb_1.query.Collection(collection),
            fields: {
                search: faunadb_1.query.Query(faunadb_1.query.Lambda("instance", faunadb_1.query.Distinct(faunadb_1.query.Union(fields.map(field => NGramOnField(depth, field))))))
            }
        },
        terms: [{ binding: "search" }]
    });
}
exports.SearchIndex = SearchIndex;
//# sourceMappingURL=index.js.map