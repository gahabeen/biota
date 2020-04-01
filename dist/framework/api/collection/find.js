"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require("querystring");
const faunadb_1 = require("faunadb");
const tasks_1 = require("~/tasks");
const udfunction_1 = require("~/factory/classes/udfunction");
function parseSearchQuery(collection, searchQuery) {
    const buildQuery = (sq) => {
        return faunadb_1.query.Call(udfunction_1.udfunctionNameNormalized("SearchQuery"), [faunadb_1.query.Collection(collection), sq]);
    };
    const safe = (x) => JSON.parse(JSON.stringify(x));
    const operators = {
        $and: (...queries) => {
            return faunadb_1.query.Intersection(...queries.map(buildQuery));
        },
        $or: (...queries) => {
            console.log("queries", queries);
            return faunadb_1.query.Union(...queries.map(buildQuery));
        },
        $nor: (query, ...queries) => {
            return faunadb_1.query.Difference(buildQuery(query), ...queries.map(buildQuery));
        }
        // $not: (source: Fauna.Expr, query: Fauna.Expr) =>
        //   q.Difference(source, query)
        // $distinct: (queries: Fauna.Expr[]) => q.Distinct(queries)
    };
    const isOperator = (key) => Object.keys(operators).includes(key);
    const hasOperators = (obj) => Object.keys(obj).some(key => Object.keys(operators).includes(key));
    const getFirstOperator = (obj) => {
        return Object.keys(obj).find(key => isOperator(key));
    };
    // UPDATE!
    const reducer = (obj) => {
        let reduced = {};
        const reducee = (value, acc) => {
            if (typeof value === "object") {
                if (hasOperators(value)) {
                    let operator = getFirstOperator(value);
                    let operatorValue = value[operator];
                    let operation = operators[operator](...operatorValue);
                    Object.assign(acc, operation);
                }
                else {
                    for (let key in value) {
                        acc[key] = {};
                        reducee(value[key], acc[key]);
                    }
                }
            }
            else if (Array.isArray(value)) {
                acc = value.map((item) => {
                    if (typeof item === "object" || Array.isArray(item)) {
                        return reducer(item);
                    }
                    else {
                        return item;
                    }
                });
            }
            else {
                acc = value;
            }
        };
        reducee(obj, reduced);
        return reduced;
    };
    if (!searchQuery) {
        return faunadb_1.query.Documents(faunadb_1.query.Collection(collection));
    }
    if (!hasOperators(searchQuery)) {
        return buildQuery(searchQuery);
    }
    else {
        return reducer(searchQuery);
    }
}
exports.parseSearchQuery = parseSearchQuery;
function find(collectionDefinition) {
    let self = this;
    return async function findMethod(searchQuery, paginateOptions = {}, mapper = faunadb_1.query.Lambda("x", faunadb_1.query.Get(faunadb_1.query.Var("x")))) {
        return tasks_1.execute([
            {
                name: `Find (${qs.stringify(searchQuery).slice(0, 20)}...) in (${collectionDefinition.name})`,
                task() {
                    let paginate = faunadb_1.query.Paginate(parseSearchQuery(collectionDefinition.name, searchQuery), paginateOptions);
                    return self.query(mapper ? faunadb_1.query.Map(paginate, mapper) : paginate);
                }
            }
        ], {
            domain: "DB.collection.find"
        });
    };
}
exports.find = find;
//# sourceMappingURL=find.js.map