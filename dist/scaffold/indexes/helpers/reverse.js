"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
exports.ReverseIndex = (index) => {
    let { terms, data } = index || {};
    let [firstTerm = {}, ...otherTerms] = terms || [];
    firstTerm.reverse = true;
    return {
        ...index,
        name: `${index.name}__reverse`,
        terms: [firstTerm, ...otherTerms],
        data: { ...data, reverse: true }
    };
};
//# sourceMappingURL=reverse.js.map