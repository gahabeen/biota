import { query as q } from 'faunadb';
import { FactoryIndexesApi } from 'types/factory/factory.indexes';
import { FactoryContext } from '~/../types/factory/factory.context';
import { pathString } from '~/framework/helpers/path';
import { BiotaIndexName } from '../constructors';
import { ContextExtend } from '../constructors/context';
import { ThrowError } from '../constructors/error';
import { DefaultToOjbect } from './ql/defaultTo';
import { Query, MethodDispatch } from '../constructors/method';
import { BiotaFunctionName } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const indexes: FactoryContext<FactoryIndexesApi> = function (context): FactoryIndexesApi {
  return {
    findIndex(resource, termsByPath) {
      const inputs = { resource, termsByPath };
      // ---
      const query = Query(
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
      const query = Query(
        {
          searchTerms: q.ToArray(searchTerms),
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
      pagination = DefaultToOjbect(pagination);
      const inputs = { resource, pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Match(q.Index(BiotaIndexName('indexes__by__resource')), q.Var('resource')), q.Var('pagination')),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.findByResource';
      const online = { name: BiotaFunctionName('IndexesFindByResource'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    findByTerm(term, pagination) {
      pagination = DefaultToOjbect(pagination);
      const inputs = { term, pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Match(q.Index(BiotaIndexName('indexes__by__terms')), q.Var('term')), q.Var('pagination')),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.findByResource';
      const online = { name: BiotaFunctionName('IndexesFindByResource'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Indexes(), pagination),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.indexes.paginate';
      const online = { name: BiotaFunctionName('IndexesPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
