"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function PageInstance(page) {
    this.value = page;
    return this;
}
PageInstance.prototype.data = function () {
    return this.value.data;
};
async function Page(cursor) {
    return cursor.next().then(({ value }) => {
        if (!value) {
            return { data: [] };
        }
        else {
            return value;
        }
    });
}
exports.Page = Page;
//# sourceMappingURL=index.js.map