import { Biota } from './biota';
import { factory } from './factory';
import { query as q } from 'faunadb';
import { Page } from './tools/page';

export const c = factory.constructors;
export const ql = factory.ql;
export { factory, Page, Biota, q };
