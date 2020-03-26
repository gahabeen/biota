"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function IndexName(name) {
    return `biota.${name.replace('biota.', '')}`;
}
exports.IndexName = IndexName;
function Index(index) {
    let { name, source = {}, terms = [], values = [], unique = false, serialized = false, permissions = {}, data = {} } = index || {};
    let self = {
        name: IndexName(name),
        source,
        terms,
        values,
        unique,
        serialized,
        permissions,
        data
        // addTerm(newTerm: FaunaIndexTerm): FaunaIndexOptions {
        //   return Index({ ...index, terms: [...terms, newTerm] })
        // },
        // addValue(newValue: FaunaIndexValue): FaunaIndexOptions {
        //   return Index({ ...index, values: [...values, newValue] })
        // },
        // addSourceField(fields: FaunaIndexSourceFields): FaunaIndexOptions {
        //   return Index({ ...index, source: { ...source, fields: { ...(source.fields || {}), ...fields } } })
        // },
        // setData(newData: any): FaunaIndexOptions {
        //   return Index({ ...index, data: newData })
        // }
    };
    return self;
}
exports.Index = Index;
//# sourceMappingURL=wrapper.js.map