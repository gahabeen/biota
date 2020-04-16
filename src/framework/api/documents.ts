import { FrameworkDocumentsApi } from '~/../types/framework/framework.documents';

import { activity } from '~/framework/api/documents/activity';
import { findAll } from '~/framework/api/documents/findAll';
import { deleteMany } from '~/framework/api/documents/deleteMany';
import { expireManyAt } from '~/framework/api/documents/expireManyAt';
import { expireManyIn } from '~/framework/api/documents/expireManyIn';
import { expireManyNow } from '~/framework/api/documents/expireManyNow';
import { forgetMany } from '~/framework/api/documents/forgetMany';
import { getMany } from '~/framework/api/documents/getMany';
import { insertMany } from '~/framework/api/documents/insertMany';
import { replaceMany } from '~/framework/api/documents/replaceMany';
import { repsertMany } from '~/framework/api/documents/repsertMany';
import { restoreMany } from '~/framework/api/documents/restoreMany';
import { updateMany } from '~/framework/api/documents/updateMany';
import { upsertMany } from '~/framework/api/documents/upsertMany';
import { dropMany } from '~/framework/api/documents/dropMany';

export const documents: FrameworkDocumentsApi = {
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
