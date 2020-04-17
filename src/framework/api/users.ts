import { FrameworkUsersApi } from '~/../types/framework/framework.users';

import { activity } from '~/framework/api/users/activity';
import { findAll } from '~/framework/api/users/findAll';
import { deleteMany } from '~/framework/api/users/deleteMany';
import { expireManyAt } from '~/framework/api/users/expireManyAt';
import { expireManyIn } from '~/framework/api/users/expireManyIn';
import { expireManyNow } from '~/framework/api/users/expireManyNow';
import { forgetMany } from '~/framework/api/users/forgetMany';
import { getMany } from '~/framework/api/users/getMany';
import { insertMany } from '~/framework/api/users/insertMany';
import { replaceMany } from '~/framework/api/users/replaceMany';
import { repsertMany } from '~/framework/api/users/repsertMany';
import { restoreMany } from '~/framework/api/users/restoreMany';
import { updateMany } from '~/framework/api/users/updateMany';
import { upsertMany } from '~/framework/api/users/upsertMany';
import { dropMany } from '~/framework/api/users/dropMany';
import { getByAuthAccount } from '~/framework/api/users/getByAuthAccount';
import { getByAuthEmail } from '~/framework/api/users/getByAuthEmail';

export const users: FrameworkUsersApi = {
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
  getByAuthAccount,
  getByAuthEmail,
};
