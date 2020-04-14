import { query as q } from 'faunadb';
import { FactoryAction } from '~/../types/factory/factory.action';
import { FactoryContext } from '~/../types/factory/factory.context';
import { ContextProp, ContextExtend } from '~/factory/constructors/context';
import { document } from '~/factory/api/document';
import { BiotaCollectionName } from '../constructors/collection';
import { ThrowError } from '../constructors/error';
import { CallFunction } from '../constructors/udfunction';

// tslint:disable-next-line: only-arrow-functions
export const action: FactoryContext<FactoryAction> = function (context): FactoryAction {
  context = ContextExtend(context);
  const offline = ContextProp(context, 'offline');
  // tslint:disable-next-line: only-arrow-functions
  return (name = null, refOrDoc = null) => {
    const ref = q.If(
      q.IsRef(refOrDoc),
      refOrDoc,
      q.If(q.IsObject(refOrDoc), q.If(q.Contains('ref', refOrDoc), q.Select('ref', refOrDoc, null), null), null),
    );

    return {
      insert() {
        const ctx = ContextExtend(context, 'factory.action.insert');
        return q.If(
          ContextProp(ctx, 'logActions'),
          q.If(
            q.And(q.IsString(name), q.IsRef(ref)),
            q.Create(BiotaCollectionName('actions'), {
              data: {
                name,
                instance: ref,
                ts: q.Now(),
                user: ContextProp(ctx, 'identity'),
              },
            }),
            ThrowError(ctx, 'Wrong inputs', { name, ref, ts: q.Now() }),
          ),
          false,
        );
      },
    };
  };
};
