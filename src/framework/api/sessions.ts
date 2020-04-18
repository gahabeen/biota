import { FrameworkSessionsApi } from '~/types/framework/framework.sessions';

import { activity } from '~/framework/api/sessions/activity';
import { findAll } from '~/framework/api/sessions/findAll';
import { deleteMany } from '~/framework/api/sessions/deleteMany';
import { expireManyAt } from '~/framework/api/sessions/expireManyAt';
import { expireManyIn } from '~/framework/api/sessions/expireManyIn';
import { expireManyNow } from '~/framework/api/sessions/expireManyNow';
import { forgetMany } from '~/framework/api/sessions/forgetMany';
import { getMany } from '~/framework/api/sessions/getMany';
import { insertMany } from '~/framework/api/sessions/insertMany';
import { replaceMany } from '~/framework/api/sessions/replaceMany';
import { repsertMany } from '~/framework/api/sessions/repsertMany';
import { restoreMany } from '~/framework/api/sessions/restoreMany';
import { updateMany } from '~/framework/api/sessions/updateMany';
import { upsertMany } from '~/framework/api/sessions/upsertMany';
import { dropMany } from '~/framework/api/sessions/dropMany';

export const sessions: FrameworkSessionsApi = {
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
