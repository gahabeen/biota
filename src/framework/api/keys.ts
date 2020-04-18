import { FrameworkKeysApi } from '~/types/framework/framework.keys';

import { activity } from '~/framework/api/keys/activity';
import { findAll } from '~/framework/api/keys/findAll';
import { deleteMany } from '~/framework/api/keys/deleteMany';
import { expireManyAt } from '~/framework/api/keys/expireManyAt';
import { expireManyIn } from '~/framework/api/keys/expireManyIn';
import { expireManyNow } from '~/framework/api/keys/expireManyNow';
import { forgetMany } from '~/framework/api/keys/forgetMany';
import { getMany } from '~/framework/api/keys/getMany';
import { insertMany } from '~/framework/api/keys/insertMany';
import { replaceMany } from '~/framework/api/keys/replaceMany';
import { repsertMany } from '~/framework/api/keys/repsertMany';
import { restoreMany } from '~/framework/api/keys/restoreMany';
import { updateMany } from '~/framework/api/keys/updateMany';
import { upsertMany } from '~/framework/api/keys/upsertMany';
import { dropMany } from '~/framework/api/keys/dropMany';

export const keys: FrameworkKeysApi = {
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
