"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Index(index) {
    let { name, source = {}, terms = [], values = [], unique = false, serialized = false, permissions = {}, data = {} } = index || {};
    let self = {
        name,
        source,
        terms,
        values,
        unique,
        serialized,
        permissions,
        data,
        addTerm(newTerm) {
            return Index({ ...index, terms: [...terms, newTerm] });
        },
        addValue(newValue) {
            return Index({ ...index, values: [...values, newValue] });
        },
        addSourceField(fields) {
            return Index({ ...index, source: { ...source, fields: { ...(source.fields || {}), ...fields } } });
        },
        setData(newData) {
            return Index({ ...index, data: newData });
        }
    };
    return self;
}
exports.Index = Index;
//# sourceMappingURL=index.js.map