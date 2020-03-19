// types
import { FaunaCollectionOptions, Fauna.Expr, DBScaffold } from '~/types'
// biota
import { DB } from '~/index'
import { ActivityIndex } from '~/lib/index'


// import { indexes__by__terms, indexes__by__resource, users__by__roles } from '../index/defaults'

function scaffoldCollection(this: DB, name: string, options: FaunaCollectionOptions = {}): Fauna.Expr {
  return this.execute([
    {
      title: 'upsert: collection - users',
      task: ({ step, wrap }) => {
        step.next('querying')
        return wrap(
          this.query(
            this.upsert.collection('users', {
              history_days: null,
              ttl_days: null
            })
          )
        )
      }
    }
    // {
    //   title: 'scaffold: indexes - users',
    //   task: ({ step, wrap }) => {
    //     return this.scaffold.indexes.for(name)
    //   }
    // }
  ])
}

function scaffoldCollectionsDefaults(this: DB): Promise<any> {
  return this.execute(
    [
      {
        title: 'scaffold: defaults',
        task: () => {
          // return Promise.resolve(
          return this.execute([
            {
              title: 'scaffold: collection - users',
              task: ({ step, wrap }) => {
                step.next('running...')
                return this.delay(800).then(() =>
                  wrap(
                    this.scaffold.collection('users', {
                      history_days: null,
                      ttl_days: null
                    })
                  )
                )
              }
            }
            // {
            //   title: 'scaffold: collection - actions',
            //   task: ({ step, wrap }) => {
            //     step.next('running...')
            //     return this.scaffold.collection('actions', {
            //       history_days: null,
            //       ttl_days: null
            //     })
            //   }
            // }
          ])
          // ).then(() => {
          //   step.complete()
          // })
        }
      }
    ],
    {},
    true
  )
}

export const scaffold: DBScaffold = {
  collection: scaffoldCollection,
  collections: {
    defaults: scaffoldCollectionsDefaults
  },
  indexes: {
    defaults: function scaffoldIndexesDefaults(this: DB): Fauna.Expr {
      // return {
      //   indexes__by__terms: this.upsert.index(indexes__by__terms),
      //   indexes__by__resource: this.upsert.index(indexes__by__resource),
      //   users__by__roles: this.upsert.index(users__by__roles)
      // }
    },
    for: function scaffoldIndexeFor(this: DB, collection: string): Fauna.Expr {
      return {
        activity_indexes: ActivityIndex(collection).map((index) => {
          return this.upsert.index(index.name, index)
        })
      }
    }
  }
  // functions: {
  //   defaults() {
  //     return ()
  //   },
  //   for(collection: string) {
  //     return ()
  //   }
  // },
  // roles: {
  //   defaults() {
  //     return ()
  //   },
  //   for(collection: string) {
  //     return ()
  //   }
  // }
}
