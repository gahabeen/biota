import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryHistoryApi } from '~/types/factory/factory.history';

import { Query, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const history: FactoryContext<FactoryHistoryApi> = function (context): FactoryHistoryApi {
  return {
    at(ts, expression) {
      const inputs = { ts, expression };
      // ---
      const query = Query(
        {
          doc: q.At(q.Var('ts'), q.Var('expression')),
        },
        q.Var('doc'),
      );
      // ---
      const offline = 'factory.history.at';
      const online = { name: BiotaFunctionName('HistoryAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    events(ref) {
      const inputs = { ref };
      // ---
      const query = Query(
        {
          doc: q.Events(q.Var('ref')),
        },
        q.Var('doc'),
      );
      // ---
      const offline = 'factory.history.at';
      const online = { name: BiotaFunctionName('HistoryEvents'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
