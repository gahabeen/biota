const fauna = require('faunadb')
const q = fauna.query

const admin = 'fnADl3L14gACAN1240NBqELzyCgQ6roS3fr_6MIV'

const c = new fauna.Client({ secret: admin })

// c.query(q.Identify(q.Ref(q.Collection('users'), '3652263320760886'), 'test'))
c.query(q.Identify(q.Ref(q.Collection('users'), '259325308321137154'), 'test'))
  .then(console.log)
  .catch(console.error)
