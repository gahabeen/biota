import { FrameworkDatabasesApi } from '~/../types/framework/framework.databases';

import { activity } from '~/framework/api/databases/activity';
import { findAll } from '~/framework/api/databases/findAll';
import { deleteMany } from '~/framework/api/databases/deleteMany';
import { expireManyAt } from '~/framework/api/databases/expireManyAt';
import { expireManyIn } from '~/framework/api/databases/expireManyIn';
import { expireManyNow } from '~/framework/api/databases/expireManyNow';
import { forgetMany } from '~/framework/api/databases/forgetMany';
import { getMany } from '~/framework/api/databases/getMany';
import { insertMany } from '~/framework/api/databases/insertMany';
import { replaceMany } from '~/framework/api/databases/replaceMany';
import { repsertMany } from '~/framework/api/databases/repsertMany';
import { restoreMany } from '~/framework/api/databases/restoreMany';
import { updateMany } from '~/framework/api/databases/updateMany';
import { upsertMany } from '~/framework/api/databases/upsertMany';
import { dropMany } from '~/framework/api/databases/dropMany';

export const databases: FrameworkDatabasesApi = {
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
};
