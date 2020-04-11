import { DBFactoryFQLUDFForget } from '~/../types/factory/factory.fql.udf';
import { query as q } from 'faunadb';
import { CallLogAction, CallSystemOperator, CallIsPrivateKeyValid } from '~/framework/helpers/call_functions';
import { forget as forgetBaseFQL } from '~/factory/api/fql/base/forget';
import { update as updateBaseFQL } from '~/factory/api/fql/base/update';

let forgotLogData = {
  _activity: { forgotten_by: q.Var('identity'), forgotten_at: q.Now() },
};

export const forget: DBFactoryFQLUDFForget = {
  document(collection, id) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.document(collection, id, forgotLogData)),
        doc: forgetBaseFQL.document(collection, id),
        action: CallLogAction('forget', q.Var('doc')),
      },
      q.Var('doc'),
    );
  },
  database(name) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.database(name, { data: forgotLogData })),
        doc: forgetBaseFQL.database(name),
        action: CallLogAction('forget', q.Var('doc')),
      },
      q.Var('doc'),
    );
  },
  collection(name) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.collection(name, { data: forgotLogData })),
        doc: forgetBaseFQL.collection(name),
        action: CallLogAction('forget', q.Var('doc')),
      },
      q.Var('doc'),
    );
  },
  index(name) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.index(name, { data: forgotLogData })),
        doc: forgetBaseFQL.index(name),
        action: CallLogAction('forget', q.Var('doc')),
      },
      q.Var('doc'),
    );
  },
  udfunction(name) {
    return q.Let(
      {
        // #improve

        operation: CallSystemOperator(updateBaseFQL.udfunction(name, { data: forgotLogData })),
        doc: forgetBaseFQL.udfunction(name),
        action: CallLogAction('forget', q.Var('doc')),
      },
      q.Var('doc'),
    );
  },
  role(name) {
    return q.Let(
      {
        // #improve
        // operation: CallSystemOperator(updateBaseFQL.role(name, { data: forgotLogData })),
        doc: forgetBaseFQL.role(name),
        action: CallLogAction('forget', q.Var('doc')),
      },
      q.Var('doc'),
    );
  },
  token(id) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.token(id, { data: forgotLogData })),
        doc: forgetBaseFQL.token(id),
        action: CallLogAction('forget', q.Var('doc')),
      },
      q.Var('doc'),
    );
  },
  key(id) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.key(id, { data: forgotLogData })),
        doc: forgetBaseFQL.key(id),
        action: CallLogAction('forget', q.Var('doc')),
      },
      q.Var('doc'),
    );
  },
};
