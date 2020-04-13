import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryIndexesApi } from 'types/factory/factory.indexes';
import { DefaultToOjbect } from './ql/defaultTo';
import { BiotaFunctionName } from '../constructors/udfunction';
import { pathString } from '~/framework/helpers/path';
import { BiotaIndexName } from '../constructors';
import { ThrowError } from '../constructors/error';
import { ContextExtend } from '../constructors/context';

// tslint:disable-next-line: only-arrow-functions
export const indexes: FactoryContext<FactoryIndexesApi> = function (context): FactoryIndexesApi {
  return {
    findIndex(resource, termFields) {
      const ctx = ContextExtend(context, 'factory.indexes.findIndex');
      return q.Let(
        {
          indexes: q.Paginate(
            q.Intersection(
              q.Match(q.Index(BiotaIndexName('indexes__by__resource')), [resource]),
              q.Union(q.Map(termFields, q.Lambda(['field'], q.Match(q.Index(BiotaIndexName('indexes__by__terms')), [q.Var('field')])))),
            ),
          ),
          termsCount: q.Count(termFields),
          filteredIndexes: q.Filter(
            q.Var('indexes'),
            q.Lambda(['index'], q.Equals(q.Var('termsCount'), q.Count(q.Select('terms', q.Get(q.Var('index')), Infinity)))),
          ),
        },
        q.Select(0, q.Var('filteredIndexes'), null),
      );
    },
    searchQuery(resource, searchTerms) {
      const ctx = ContextExtend(context, 'factory.indexes.searchQuery');
      return q.Let(
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
                    indexes(ctx).findIndex(resource, [q.Concat(['binding:', q.Var('field')])]),
                    q.Select('$computed', q.Var('value'), null),
                    q.Concat(['binding:', pathString(q.Var('field'))]),
                  ],
                  q.If(
                    q.Contains('$ngram', q.Var('value')),
                    [
                      indexes(ctx).findIndex(resource, [q.Concat(['binding:', 'ngram:', q.Var('field')])]),
                      q.LowerCase(q.ToString(q.Select('$ngram', q.Var('value'), ''))),
                      q.Concat(['ngram:', pathString(q.Var('field'))]),
                    ],
                    [null, null, null],
                  ),
                ),
                [indexes(ctx).findIndex(resource, [q.Concat(['term:', pathString(q.Var('field'))])]), q.Var('value'), q.Var('field')],
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
          ThrowError(ctx, "Indexes couldn't be found", { resource, searchTerms, unvalidFields: q.Var('unvalidFields') }),
        ),
      );
    },
    findByResource(resource, pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Match(q.Index(BiotaIndexName('indexes__by__resource')), resource), pagination);
    },
    findByTerm(term, pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Match(q.Index(BiotaIndexName('indexes__by__terms')), term), pagination);
    },
    paginate(pagination) {
      pagination = DefaultToOjbect(pagination);
      return q.Paginate(q.Indexes(), pagination);
    },
  };
};
