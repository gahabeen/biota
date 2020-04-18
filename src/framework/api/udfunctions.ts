import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';

import { activity } from '~/framework/api/udfunctions/activity';
import { findAll } from '~/framework/api/udfunctions/findAll';
import { deleteMany } from '~/framework/api/udfunctions/deleteMany';
import { expireManyAt } from '~/framework/api/udfunctions/expireManyAt';
import { expireManyIn } from '~/framework/api/udfunctions/expireManyIn';
import { expireManyNow } from '~/framework/api/udfunctions/expireManyNow';
import { forgetMany } from '~/framework/api/udfunctions/forgetMany';
import { getMany } from '~/framework/api/udfunctions/getMany';
import { insertMany } from '~/framework/api/udfunctions/insertMany';
import { replaceMany } from '~/framework/api/udfunctions/replaceMany';
import { repsertMany } from '~/framework/api/udfunctions/repsertMany';
import { restoreMany } from '~/framework/api/udfunctions/restoreMany';
import { updateMany } from '~/framework/api/udfunctions/updateMany';
import { upsertMany } from '~/framework/api/udfunctions/upsertMany';
import { dropMany } from '~/framework/api/udfunctions/dropMany';
import { scaffold } from '~/framework/api/udfunctions/scaffold';

export const udfunctions: FrameworkUDFunctionsApi = {
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
};
