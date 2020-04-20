import { query as q } from 'faunadb';
import { FactoryIndexesApi } from '~/types/factory/factory.indexes';
import { FactoryContext } from '~/types/factory/factory.context';
import { pathString } from '~/helpers/path';
import { index } from '.';
import { BiotaIndexName } from '~/factory/constructors';
import { ThrowError } from '~/factory/constructors/error';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { ResultData } from '~/factory/constructors/result';
import { BiotaFunctionName } from './constructors';
import { Pagination } from '../constructors/pagination';

// tslint:disable-next-line: only-arrow-functions
export const indexes: FactoryContext<FactoryIndexesApi> = function (context): FactoryIndexesApi {
  return {
    findIndex(resource, termsByPath) {
      const inputs = { resource, termsByPath };
      // ---
      const query = MethodQuery(
        {
          indexes: q.Paginate(
            q.Intersection(
              q.Match(q.Index(BiotaIndexName('indexes__by__resource')), [q.Var('resource')]),
              q.Union(
                q.Map(q.Var('termsByPath'), q.Lambda(['field'], q.Match(q.Index(BiotaIndexName('indexes__by__terms')), [q.Var('field')]))),
              ),
            ),
          ),
          termsCount: q.Count(q.Var('termsByPath')),
          filteredIndexes: q.Filter(
            q.Var('indexes'),
            q.Lambda(['index'], q.Equals(q.Var('termsCount'), q.Count(q.Select('terms', q.Get(q.Var('index')), Infinity)))),
          ),
        },
        q.Select(0, q.Var('filteredIndexes'), null),
      );
      // ---
      const offline = 'factory.indexes.findIndex';
      const online = { name: BiotaFunctionName('IndexesFindIndex'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    searchQuery(resource, searchTerms) {
      const inputs = { resource, searchTerms };
      // ---
      const query = MethodQuery(
        {
          searchTerms: q.ToArray(q.Var('searchTerms')),
          termIndexes: q.Map(
            q.Var('searchTerms'),
            q.Lambda(
              ['field', 'value'],
              q.If(
                q.IsObject(q.Var('value')),
                q.If(
                  q.Contains('$computed', q.Var('value')),
                  [
                    indexes(q.Var('ctx')).findIndex(q.Var('resource'), [q.Concat(['binding:', q.Var('field')])]),
                    q.Select('$computed', q.Var('value'), null),
                    q.Concat(['binding:', pathString(q.Var('field'))]),
                  ],
                  q.If(
                    q.Contains('$ngram', q.Var('value')),
                    [
                      indexes(q.Var('ctx')).findIndex(q.Var('resource'), [q.Concat(['binding:', 'ngram:', q.Var('field')])]),
                      q.LowerCase(q.ToString(q.Select('$ngram', q.Var('value'), ''))),
                      q.Concat(['ngram:', pathString(q.Var('field'))]),
                    ],
                    [null, null, null],
                  ),
                ),
                [
                  indexes(q.Var('ctx')).findIndex(q.Var('resource'), [q.Concat(['term:', pathString(q.Var('field'))])]),
                  q.Var('value'),
                  q.Var('field'),
                ],
              ),
            ),
          ),
          validTermIndexes: q.Filter(q.Var('termIndexes'), q.Lambda(['index', 'value', 'field'], q.IsIndex(q.Var('index')))),
          unvalidIndexes: q.Filter(q.Var('termIndexes'), q.Lambda(['index', 'value', 'field'], q.Not(q.IsIndex(q.Var('index'))))),
          unvalidFields: q.Concat(q.Map(q.Var('unvalidIndexes'), q.Lambda(['index', 'value', 'field'], q.Var('field'))), ', '),
        },
        q.If(
          q.LT(q.Count(q.Var('unvalidIndexes')), 1),
          q.Intersection(q.Map(q.Var('validTermIndexes'), q.Lambda(['index', 'value', 'field'], q.Match(q.Var('index'), q.Var('value'))))),
          ThrowError(q.Var('ctx'), "Indexes couldn't be found", {
            resource: q.Var('resource'),
            searchTerms: q.Var('searchTerms'),
            unvalidFields: q.Var('unvalidFields'),
          }),
        ),
      );
      // ---
      const offline = 'factory.indexes.searchQuery';
      const online = { name: BiotaFunctionName('IndexesSearchQuery'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    findByResource(resource, pagination) {
      const inputs = { resource, pagination };
      // ---
      const query = MethodQuery(
        {
          docs: q.Paginate(q.Match(q.Index(BiotaIndexName('indexes__by__resource')), q.Var('resource')), Pagination(q.Var('pagination'))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.findByResource';
      const online = { name: BiotaFunctionName('IndexesFindByResource'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    findByTerm(term, pagination) {
      const inputs = { term, pagination };
      // ---
      const query = MethodQuery(
        {
          docs: q.Paginate(q.Match(q.Index(BiotaIndexName('indexes__by__terms')), q.Var('term')), Pagination(q.Var('pagination'))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.findByResource';
      const online = { name: BiotaFunctionName('IndexesFindByResource'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    findAll(pagination) {
      const inputs = { pagination };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Paginate(q.Indexes(), pagination), q.Lambda('x', q.Get(q.Var('x')))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.paginate';
      const online = { name: BiotaFunctionName('IndexesFindAll'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(index(q.Var('ctx'))(q.Var('name')).get()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.getMany';
      const online = { name: BiotaFunctionName('IndexesGetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    insertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(index(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).insert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.insertMany';
      const online = { name: BiotaFunctionName('IndexesInsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    updateMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(index(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).update(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.updateMany';
      const online = { name: BiotaFunctionName('IndexesUpdateMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    upsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(index(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).upsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.upsertMany';
      const online = { name: BiotaFunctionName('IndexesUpsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    replaceMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(index(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).replace(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.replaceMany';
      const online = { name: BiotaFunctionName('IndexesReplaceMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    repsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(index(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).repsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.repsertMany';
      const online = { name: BiotaFunctionName('IndexesRepsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    deleteMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(index(q.Var('ctx'))(q.Var('name')).delete()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.deleteMany';
      const online = { name: BiotaFunctionName('IndexesDeleteMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    restoreMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(index(q.Var('ctx'))(q.Var('name')).restore()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.restoreMany';
      const online = { name: BiotaFunctionName('IndexesRestoreMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    forgetMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(index(q.Var('ctx'))(q.Var('name')).forget()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.forgetMany';
      const online = { name: BiotaFunctionName('IndexesForgetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    dropMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(index(q.Var('ctx'))(q.Var('name')).drop()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.dropMany';
      const online = { name: BiotaFunctionName('IndexesDropMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyAt(nameList, at) {
      const inputs = { nameList, at };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(index(q.Var('ctx'))(q.Var('name')).expireAt(q.Var('at'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.expireManyAt';
      const online = { name: BiotaFunctionName('IndexesExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyIn(nameList, delay) {
      const inputs = { nameList, delay };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(index(q.Var('ctx'))(q.Var('name')).expireIn(q.Var('delay'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.expireManyAt';
      const online = { name: BiotaFunctionName('IndexesExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyNow(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(index(q.Var('ctx'))(q.Var('name')).expireNow()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.expireManyNow';
      const online = { name: BiotaFunctionName('IndexesExpireManyNow'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
