"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ReverseIndex(index) {
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
exports.ReverseIndex = ReverseIndex;
//# sourceMappingURL=reverse.js.map