import { query as q } from 'faunadb';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { ResultAction, ResultData } from '~/factory/constructors/result';
import { BiotaFunctionName } from '~/factory/constructors/udfunction';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryProxyPublicDocument } from '~/types/factory/factory.proxy.public.document';
import { document as documentFactory } from '~/factory/api/document';
import { BiotaRoleName } from '../../constructors';

// tslint:disable-next-line: only-arrow-functions
export const document: FactoryContext<FactoryProxyPublicDocument> = function (context): FactoryProxyPublicDocument {
  // tslint:disable-next-line: only-arrow-functions
  return (collection = null, id = null) => {
    return {
      get() {
        const inputs = { collection, id };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: documentFactory(q.Var('ctx'))(q.Var('collection'), q.Var('id')).get(),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ↓↓↓↓
        const offline = `factory.proxy.document.public`;
        const online = {
          name: BiotaFunctionName(`ProxyPublicDocumentGet`),
          role: q.Role(BiotaRoleName('public_access')),
          data: { meta: { addToRoles: [BiotaRoleName('public'), BiotaRoleName('user')] } },
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
