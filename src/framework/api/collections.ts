import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { activity } from '~/framework/api/collections/activity';
import { deleteMany } from '~/framework/api/collections/deleteMany';
import { dropMany } from '~/framework/api/collections/dropMany';
import { expireManyAt } from '~/framework/api/collections/expireManyAt';
import { expireManyIn } from '~/framework/api/collections/expireManyIn';
import { expireManyNow } from '~/framework/api/collections/expireManyNow';
import { findAll } from '~/framework/api/collections/findAll';
import { forgetMany } from '~/framework/api/collections/forgetMany';
import { getMany } from '~/framework/api/collections/getMany';
import { insertMany } from '~/framework/api/collections/insertMany';
import { replaceMany } from '~/framework/api/collections/replaceMany';
import { repsertMany } from '~/framework/api/collections/repsertMany';
import { restoreMany } from '~/framework/api/collections/restoreMany';
import { updateMany } from '~/framework/api/collections/updateMany';
import { upsertMany } from '~/framework/api/collections/upsertMany';
import { scaffold } from '~/framework/api/collections/scaffold';
import { dismantle } from '~/framework/api/collections/dismantle';

export const collections: FrameworkCollectionsApi = {
  activity,
  findAll,
  deleteMany,
  expireManyAt,
  expireManyIn,
  expireManyNow,
  forgetMany,
  getMany,
  insertMany,
  replaceMany,
  repsertMany,
  restoreMany,
  updateMany,
  upsertMany,
  dropMany,
  scaffold,
  dismantle,
};
