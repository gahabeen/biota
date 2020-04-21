import { Biota } from './biota';
import { factory } from './factory';
import { query as q } from 'faunadb';
import { Page } from './tools/page';
import { toJSON, parseJSON } from '~/helpers/fauna/parse';
import { wrap } from '~/helpers/fauna/wrap';

export const f = { toJSON, parseJSON, wrap };
export const c = factory.constructors;
export const ql = factory.ql;
export { factory, Page, Biota, q };
