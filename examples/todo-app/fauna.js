const fauna = require('faunadb')

;(async () => {
  const client = new fauna.Client({ secret: "fnEDma7MwkACAAOXbOZ90AILyA1rO0xt_DQlgHDqO9ufijv51n4" })
  client
    .query(fauna.query.Identity())
    .then(console.log)
    .catch(console.error)
})()
