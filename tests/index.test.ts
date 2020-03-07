import { query as q } from 'faunadb'
import { client } from './client'

const db = client()

describe('DB.collections', () => {
  test('returns collections', async () => {
    const collections = await db.collections().query()
    // expect(collections.data)
  })
})
