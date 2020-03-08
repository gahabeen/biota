import * as fauna from 'faunadb'
const q = fauna.query

import { Index } from '../methods/index'
import { Cursor, ToCursor } from '../methods/cursor'

export function activity(collection: string) {
  const owner = Index({
    name: `${collection}__by__owner`,
    source: { collection: q.Collection(collection) },
    terms: [{ field: ['data', 'activity', 'owner'] }]
  })

  const owner_changed_by = Index({
    name: `${collection}__by__owner_changed_by`,
    source: { collection: q.Collection(collection) },
    terms: [{ field: ['data', 'activity', 'owner_changed_by'] }]
  })

  const owner_changed_at = Index({
    name: `${collection}__by__owner_changed_at`,
    source: { collection: q.Collection(collection) },
    terms: [{ field: ['data', 'activity', 'owner_changed_at'] }]
  })

  const owner_changed_at__cursor = ToCursor(owner_changed_at)

  return [
    owner,
    owner_changed_by,
    owner_changed_at,
    owner_changed_at__cursor,
    Index({
      name: `${collection}__by__owner_changed_at__reverse`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'owner_changed_at'], reverse: true }, { field: 'ref' }]
    }),
    Index({
      name: `${collection}__by__imported_by`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'imported_by'] }]
    }),
    Index({
      name: `${collection}__by__imported_at`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'imported_at'] }]
    }),
    Index({
      name: `${collection}__by__imported_at__cursor`,
      source: {
        collection: q.Collection(collection),
        fields: {
          cursor: Cursor(['data', 'activity', 'imported_at'])
        }
      },
      values: [{ binding: 'cursor' }, { field: ['ref'] }]
    }),
    Index({
      name: `${collection}__by__imported_at__reverse`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'imported_at'], reverse: true }, { field: 'ref' }]
    }),
    {
      name: `${collection}__by__created_by`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'created_by'] }]
    },
    Index({
      name: `${collection}__by__created_at`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'created_at'] }]
    }),
    Index({
      name: `${collection}__by__created_at__cursor`,
      source: {
        collection: q.Collection(collection),
        fields: {
          cursor: Cursor(['data', 'activity', 'created_at'])
        }
      },
      values: [{ binding: 'cursor' }, { field: ['ref'] }]
    }),
    Index({
      name: `${collection}__by__created_at__reverse`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'created_at'], reverse: true }, { field: 'ref' }]
    }),
    Index({
      name: `${collection}__by__updated_by`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'updated_by'] }]
    }),
    Index({
      name: `${collection}__by__updated_at`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'updated_at'] }]
    }),
    Index({
      name: `${collection}__by__updated_at__cursor`,
      source: {
        collection: q.Collection(collection),
        fields: {
          cursor: Cursor(['data', 'activity', 'updated_at'])
        }
      },
      values: [{ binding: 'cursor' }, { field: ['ref'] }]
    }),
    Index({
      name: `${collection}__by__updated_at__reverse`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'updated_at'], reverse: true }, { field: 'ref' }]
    }),
    Index({
      name: `${collection}__by__replaced_by`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'replaced_by'] }]
    }),
    Index({
      name: `${collection}__by__replaced_at`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'replaced_at'] }]
    }),
    Index({
      name: `${collection}__by__replaced_at__cursor`,
      source: {
        collection: q.Collection(collection),
        fields: {
          cursor: Cursor(['data', 'activity', 'replaced_at'])
        }
      },
      values: [{ binding: 'cursor' }, { field: ['ref'] }]
    }),
    Index({
      name: `${collection}__by__replaced_at__reverse`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'replaced_at'], reverse: true }, { field: 'ref' }]
    }),
    Index({
      name: `${collection}__by__deleted_by`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'deleted_by'] }]
    }),
    Index({
      name: `${collection}__by__deleted_at`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'deleted_at'] }]
    }),
    Index({
      name: `${collection}__by__deleted_at__cursor`,
      source: {
        collection: q.Collection(collection),
        fields: {
          cursor: Cursor(['data', 'activity', 'deleted_at'])
        }
      },
      values: [{ binding: 'cursor' }, { field: ['ref'] }]
    }),
    Index({
      name: `${collection}__by__deleted_at__reverse`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'deleted_at'], reverse: true }, { field: 'ref' }]
    }),
    Index({
      name: `${collection}__by__archived_by`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'archived_by'] }]
    }),
    Index({
      name: `${collection}__by__archived_at`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'archived_at'] }]
    }),
    Index({
      name: `${collection}__by__archived_at__cursor`,
      source: {
        collection: q.Collection(collection),
        fields: {
          cursor: Cursor(['data', 'activity', 'archived_at'])
        }
      },
      values: [{ binding: 'cursor' }, { field: ['ref'] }]
    }),
    Index({
      name: `${collection}__by__archived_at__reverse`,
      source: { collection: q.Collection(collection) },
      terms: [{ field: ['data', 'activity', 'archived_at'], reverse: true }, { field: 'ref' }]
    })
  ]
}
