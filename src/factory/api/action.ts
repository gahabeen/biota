import { query as q } from 'faunadb';
import { FactoryAction } from '~/../types/factory/factory.action';
import { FactoryContext } from '~/../types/factory/factory.context';
import { document } from '~/factory/api/document';
import { ContextProp } from '~/factory/constructors/context';
import { BiotaCollectionName } from '../constructors/collection';
import { ThrowError } from '../constructors/error';
import { MethodDispatch, Query } from '../constructors/method';

// tslint:disable-next-line: only-arrow-functions
export const action: FactoryContext<FactoryAction> = function (context): FactoryAction {
  // tslint:disable-next-line: only-arrow-functions
  return (name = null, refOrDoc = null) => {
    const ref = q.If(
      q.IsRef(refOrDoc),
      refOrDoc,
      q.If(q.IsObject(refOrDoc), q.If(q.Contains('ref', refOrDoc), q.Select('ref', refOrDoc, null), null), null),
    );

    return {
      ...document(context, { prefix: 'Action' })(ref),
      log() {
        const inputs = { ref };
        // ----
        const query = Query(
          {
            doc: q.If(
              ContextProp(q.Var('ctx'), 'logActions'),
              q.If(
                q.And(q.IsString(name), q.IsRef(q.Var('ref'))),
                q.Create(BiotaCollectionName('actions'), {
                  data: {
                    name,
                    instance: ref,
                    ts: q.Now(),
                    user: ContextProp(q.Var('ctx'), 'identity'),
                  },
                }),
                ThrowError(q.Var('ctx'), 'Wrong inputs', { name, ref, ts: q.Now() }),
              ),
              null,
            ),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.action.insert';
        const online = null;
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
