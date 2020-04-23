import { activity } from '~/framework/api/documents/activity';
import { deleteMany } from '~/framework/api/documents/deleteMany';
import { dropMany } from '~/framework/api/documents/dropMany';
import { expireManyAt } from '~/framework/api/documents/expireManyAt';
import { expireManyIn } from '~/framework/api/documents/expireManyIn';
import { expireManyNow } from '~/framework/api/documents/expireManyNow';
import { findAll } from '~/framework/api/documents/findAll';
import { forgetMany } from '~/framework/api/documents/forgetMany';
import { getMany } from '~/framework/api/documents/getMany';
import { insertMany } from '~/framework/api/documents/insertMany';
import { replaceMany } from '~/framework/api/documents/replaceMany';
import { repsertMany } from '~/framework/api/documents/repsertMany';
import { restoreMany } from '~/framework/api/documents/restoreMany';
import { updateMany } from '~/framework/api/documents/updateMany';
import { upsertMany } from '~/framework/api/documents/upsertMany';
import { inputStringLiteral } from '~/helpers/literals';
import { FrameworkDocuments } from '~/types/framework/framework.documents';

export const documents: FrameworkDocuments = function (...args) {
  const [collectionName] = inputStringLiteral(args);

  return {
    activity: activity.call(this, collectionName),
    findAll: findAll.call(this, collectionName),
    deleteMany: deleteMany.call(this, collectionName),
    expireManyAt: expireManyAt.call(this, collectionName),
    expireManyIn: expireManyIn.call(this, collectionName),
    expireManyNow: expireManyNow.call(this, collectionName),
    forgetMany: forgetMany.call(this, collectionName),
    getMany: getMany.call(this, collectionName),
    insertMany: insertMany.call(this, collectionName),
    replaceMany: replaceMany.call(this, collectionName),
    repsertMany: repsertMany.call(this, collectionName),
    restoreMany: restoreMany.call(this, collectionName),
    updateMany: updateMany.call(this, collectionName),
    upsertMany: upsertMany.call(this, collectionName),
    dropMany: dropMany.call(this, collectionName),
  };
};
