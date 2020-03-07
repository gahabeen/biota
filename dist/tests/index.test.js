"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const index_1 = require("../src/index");
const db = index_1.DB({ secret: process.argv.slice(2)[0] });
describe('DB.collections', () => {
    it('returns collections', async () => {
        const collections = await db.collections().query();
        console.log('collections', collections);
        // expect(result).to.equal(true)
    });
});
//# sourceMappingURL=index.test.js.map