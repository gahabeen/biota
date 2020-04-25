import { FrameworkKeysApi } from '~/types/framework/framework.keys';

import { activity } from '~/framework/api/keys/activity';
import { findAll } from '~/framework/api/keys/findAll';
import { forgetMany } from '~/framework/api/keys/forgetMany';
import { getMany } from '~/framework/api/keys/getMany';
import { insertMany } from '~/framework/api/keys/insertMany';
import { replaceMany } from '~/framework/api/keys/replaceMany';
import { repsertMany } from '~/framework/api/keys/repsertMany';
import { revokeMany } from '~/framework/api/keys/revokeMany';
import { updateMany } from '~/framework/api/keys/updateMany';
import { upsertMany } from '~/framework/api/keys/upsertMany';
import { dropMany } from '~/framework/api/keys/dropMany';

export const keys: FrameworkKeysApi = {
  activity,
  findAll,
  revokeMany,
  forgetMany,
  getMany,
  insertMany,
  replaceMany,
  repsertMany,
  updateMany,
  upsertMany,
  dropMany,
};
