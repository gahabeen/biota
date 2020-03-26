"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
// biota
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
//# sourceMappingURL=reverse.js.map