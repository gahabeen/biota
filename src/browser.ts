import { DB as Biota } from './db';
import { query as BiotaQ } from 'faunadb';
import * as BiotaFactory from '~/factory';
import { Page as BiotaPage } from './page';

Object.assign(window, { Biota, BiotaQ, BiotaFactory, BiotaPage });
Object.assign(global, { Biota, BiotaQ, BiotaFactory, BiotaPage });
