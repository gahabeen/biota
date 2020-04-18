import { Expr, query as q } from 'faunadb';
import { document } from '~/factory/api/document';
import { MethodDispatch, Query } from '~/factory/constructors/method';
import { ResultData } from '~/factory/constructors/result';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryDocumentsApi } from '~/types/factory/factory.documents';
import { Pagination } from '../constructors/pagination';
import { BiotaFunctionName } from './constructors';


// tslint:disable-next-line: only-arrow-functions
export const documents: FactoryContext<FactoryDocumentsApi> = function (context): FactoryDocumentsApi {
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

  return {
    findAll(collectionName, pagination) {

      const inputs = { collectionName, pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Documents(q.Collection(q.Var('collectionName'))), Pagination(q.Var('pagination'))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.documents.paginate';
      const online = { name: BiotaFunctionName('DocumentsFindAll'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getMany(refList) {
      const inputs = { refList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('refList'), q.Lambda(['ref'], ResultData(document(q.Var('ctx'))(q.Var('ref')).get()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.documents.getMany';
      const online = { name: BiotaFunctionName('DocumentsGetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    insertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(
              ['options'],
              ResultData(document(q.Var('ctx'))(q.Select('ref', q.Var('options'), null)).insert(filterOptions(q.Var('options')))),
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
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(
              ['options'],
              ResultData(document(q.Var('ctx'))(q.Select('ref', q.Var('options'), null)).update(filterOptions(q.Var('options')))),
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
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(
              ['options'],
              ResultData(document(q.Var('ctx'))(q.Select('ref', q.Var('options'), null)).upsert(filterOptions(q.Var('options')))),
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
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(
              ['options'],
              ResultData(document(q.Var('ctx'))(q.Select('ref', q.Var('options'), null)).replace(filterOptions(q.Var('options')))),
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
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(
              ['options'],
              ResultData(document(q.Var('ctx'))(q.Select('ref', q.Var('options'), null)).repsert(filterOptions(q.Var('options')))),
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
    deleteMany(refList) {
      const inputs = { refList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('refList'), q.Lambda(['ref'], ResultData(document(q.Var('ctx'))(q.Var('ref')).delete()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.documents.deleteMany';
      const online = { name: BiotaFunctionName('DocumentsDeleteMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    restoreMany(refList) {
      const inputs = { refList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('refList'), q.Lambda(['ref'], ResultData(document(q.Var('ctx'))(q.Var('ref')).restore()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.documents.restoreMany';
      const online = { name: BiotaFunctionName('DocumentsRestoreMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    forgetMany(refList) {
      const inputs = { refList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('refList'), q.Lambda(['ref'], ResultData(document(q.Var('ctx'))(q.Var('ref')).forget()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.documents.forgetMany';
      const online = { name: BiotaFunctionName('DocumentsForgetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    dropMany(refList) {
      const inputs = { refList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('refList'), q.Lambda(['ref'], ResultData(document(q.Var('ctx'))(q.Var('ref')).drop()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.documents.dropMany';
      const online = { name: BiotaFunctionName('DocumentsDropMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyAt(refList, at) {
      const inputs = { refList, at };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('refList'), q.Lambda(['ref'], ResultData(document(q.Var('ctx'))(q.Var('ref')).expireAt(q.Var('at'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.documents.expireManyAt';
      const online = { name: BiotaFunctionName('DocumentsExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyIn(refList, delay) {
      const inputs = { refList, delay };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('refList'), q.Lambda(['ref'], ResultData(document(q.Var('ctx'))(q.Var('ref')).expireIn(q.Var('delay'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.documents.expireManyAt';
      const online = { name: BiotaFunctionName('DocumentsExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyNow(refList) {
      const inputs = { refList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('refList'), q.Lambda(['ref'], ResultData(document(q.Var('ctx'))(q.Var('ref')).expireNow()))),
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
