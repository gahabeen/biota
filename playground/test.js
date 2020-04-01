const fauna = require('faunadb')
const q = fauna.query

const user = 'fnEDmLzYElACAgOXbOZ90AILenilcCDU80WNcRP2MHUtk178Ej8'
const c = new fauna.Client({ secret: user })

c.query(q.Call('update', [q.Identity(), { test: 'ok' }])).then(console.log).catch(console.error)