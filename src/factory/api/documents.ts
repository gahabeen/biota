import { Expr, query as q } from 'faunadb';
import { document } from '~/factory/api/document';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { ResultData } from '~/factory/constructors/result';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryDocuments } from '~/types/factory/factory.documents';
import { Pagination } from '../constructors/pagination';
import { BiotaFunctionName } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const documents: FactoryContext<FactoryDocuments> = function (context): FactoryDocuments {
  const filterOptions = (options: Expr) =>
    q.Let(
      {
        has_data: q.Contains(['data'], options),
        data: q.Select(['data'], options, null),
        has_credentials: q.Contains(['data'], options),
        credentials: q.Select(['data'], options, null),
      },
      q.If(
        q.And(q.Var('has_data'), q.Var('has_credentials')),
        {
          data: q.Var('data'),
          credentials: q.Var('credentials'),
        },
        q.If(q.Var('has_data'), { data: q.Var('data') }, { credentials: q.Var('credentials') }),
      ),
    );

  return (collection = null) => {
    return {
      findAll(pagination) {
        const inputs = { collection, pagination };
        // ---
        const query = MethodQuery(
          {
            docs: q.Paginate(q.Documents(q.Collection(q.Var('collection'))), Pagination(q.Var('pagination'))),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.paginate';
        const online = { name: BiotaFunctionName('DocumentsFindAll'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      getMany(idList) {
        const inputs = { collection, idList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(
              q.Var('idList'),
              q.Lambda(['id'], ResultData(document(q.Var('ctx'))(q.Ref(q.Collection(q.Var('collection')), q.Var('id'))).get())),
            ),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.getMany';
        const online = { name: BiotaFunctionName('DocumentsGetMany'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insertMany(optionsList) {
        const inputs = { collection, optionsList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(
              q.Var('optionsList'),
              q.Lambda(
                ['options'],
                ResultData(
                  document(q.Var('ctx'))(q.Var('collection'), q.Select('id', q.Var('options'), null)).insert(
                    filterOptions(q.Var('options')),
                  ),
                ),
              ),
            ),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.insertMany';
        const online = { name: BiotaFunctionName('DocumentsInsertMany'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      updateMany(optionsList) {
        const inputs = { collection, optionsList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(
              q.Var('optionsList'),
              q.Lambda(
                ['options'],
                ResultData(
                  document(q.Var('ctx'))(q.Var('collection'), q.Select('id', q.Var('options'), null)).update(
                    filterOptions(q.Var('options')),
                  ),
                ),
              ),
            ),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.updateMany';
        const online = { name: BiotaFunctionName('DocumentsUpdateMany'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsertMany(optionsList) {
        const inputs = { collection, optionsList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(
              q.Var('optionsList'),
              q.Lambda(
                ['options'],
                ResultData(
                  document(q.Var('ctx'))(q.Var('collection'), q.Select('id', q.Var('options'), null)).upsert(
                    filterOptions(q.Var('options')),
                  ),
                ),
              ),
            ),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.upsertMany';
        const online = { name: BiotaFunctionName('DocumentsUpsertMany'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replaceMany(optionsList) {
        const inputs = { collection, optionsList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(
              q.Var('optionsList'),
              q.Lambda(
                ['options'],
                ResultData(
                  document(q.Var('ctx'))(q.Var('collection'), q.Select('id', q.Var('options'), null)).replace(
                    filterOptions(q.Var('options')),
                  ),
                ),
              ),
            ),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.replaceMany';
        const online = { name: BiotaFunctionName('DocumentsReplaceMany'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsertMany(optionsList) {
        const inputs = { collection, optionsList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(
              q.Var('optionsList'),
              q.Lambda(
                ['options'],
                ResultData(
                  document(q.Var('ctx'))(q.Var('collection'), q.Select('id', q.Var('options'), null)).repsert(
                    filterOptions(q.Var('options')),
                  ),
                ),
              ),
            ),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.repsertMany';
        const online = { name: BiotaFunctionName('DocumentsRepsertMany'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      deleteMany(idList) {
        const inputs = { collection, idList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(q.Var('idList'), q.Lambda(['id'], ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).delete()))),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.deleteMany';
        const online = { name: BiotaFunctionName('DocumentsDeleteMany'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      restoreMany(idList) {
        const inputs = { collection, idList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(q.Var('idList'), q.Lambda(['id'], ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).restore()))),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.restoreMany';
        const online = { name: BiotaFunctionName('DocumentsRestoreMany'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forgetMany(idList) {
        const inputs = { collection, idList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(q.Var('idList'), q.Lambda(['id'], ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).forget()))),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.forgetMany';
        const online = { name: BiotaFunctionName('DocumentsForgetMany'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      dropMany(idList) {
        const inputs = { collection, idList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(q.Var('idList'), q.Lambda(['id'], ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).drop()))),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.dropMany';
        const online = { name: BiotaFunctionName('DocumentsDropMany'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireManyAt(idList, at) {
        const inputs = { collection, idList, at };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(
              q.Var('idList'),
              q.Lambda(['id'], ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).expireAt(q.Var('at')))),
            ),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.expireManyAt';
        const online = { name: BiotaFunctionName('DocumentsExpireManyAt'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireManyIn(idList, delay) {
        const inputs = { collection, idList, delay };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(
              q.Var('idList'),
              q.Lambda(['id'], ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).expireIn(q.Var('delay')))),
            ),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.expireManyAt';
        const online = { name: BiotaFunctionName('DocumentsExpireManyAt'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireManyNow(idList) {
        const inputs = { collection, idList };
        // ---
        const query = MethodQuery(
          {
            docs: q.Map(
              q.Var('idList'),
              q.Lambda(['id'], ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).expireNow())),
            ),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.documents.expireManyNow';
        const online = { name: BiotaFunctionName('DocumentsExpireManyNow'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
