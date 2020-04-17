import { FrameworkTokensApi } from '~/../types/framework/framework.tokens';

import { activity } from '~/framework/api/tokens/activity';
import { findAll } from '~/framework/api/tokens/findAll';
import { deleteMany } from '~/framework/api/tokens/deleteMany';
import { expireManyAt } from '~/framework/api/tokens/expireManyAt';
import { expireManyIn } from '~/framework/api/tokens/expireManyIn';
import { expireManyNow } from '~/framework/api/tokens/expireManyNow';
import { forgetMany } from '~/framework/api/tokens/forgetMany';
import { getMany } from '~/framework/api/tokens/getMany';
import { insertMany } from '~/framework/api/tokens/insertMany';
import { replaceMany } from '~/framework/api/tokens/replaceMany';
import { repsertMany } from '~/framework/api/tokens/repsertMany';
import { restoreMany } from '~/framework/api/tokens/restoreMany';
import { updateMany } from '~/framework/api/tokens/updateMany';
import { upsertMany } from '~/framework/api/tokens/upsertMany';
import { dropMany } from '~/framework/api/tokens/dropMany';

export const tokens: FrameworkTokensApi = {
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
