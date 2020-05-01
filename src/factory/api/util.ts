import { query as q } from 'faunadb';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryUtilApi } from '~/types/factory/factory.util';
import { BiotaFunctionName } from './constructors';

export const util: FactoryContext<FactoryUtilApi> = function (context): FactoryUtilApi {
  return {
    // deepMerge(obj1, obj2) {
    //   const inputs = { obj1, obj2 };
    //   // ↓↓↓↓
    //   const query = MethodQuery(
    //     {
    //       merged: q.Merge(
    //         obj1,
    //         obj2,
    //         q.Lambda(
    //           ['key1', 'value1', 'value2'],
    //           q.If(
    //             q.And(q.IsObject(q.Var('value1')), q.IsObject(q.Var('value2'))),
    //             q.Call(BiotaFunctionName('UtilDeepMerge'), q.Var('ctx'), { obj1: q.Var('value1'), obj2: q.Var('value2') }),
    //             q.Var('value2'),
    //           ),
    //         ),
    //       ),
    //     },
    //     q.Var('merged'),
    //   );
    //   // ↓↓↓↓
    //   const offline = 'factory.util.deepMerge';
    //   const online = {
    //     name: BiotaFunctionName('UtilDeepMerge'),
    //     // role: q.Role(BiotaRoleName('system')),
    //     // data: { meta: { addToRoles: [BiotaRoleName('system')] } },
    //   };
    //   return MethodDispatch({ context, inputs, query })(offline, online);
    // },
  };
};
