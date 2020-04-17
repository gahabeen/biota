import { FrameworkDocuments } from '~/../types/framework/framework.documents';
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

export const documents: FrameworkDocuments = function (collectionName) {
  const self = this;

  return {
    activity: activity.call(self, collectionName),
    findAll: findAll.call(self, collectionName),
    deleteMany: deleteMany.call(self, collectionName),
    expireManyAt: expireManyAt.call(self, collectionName),
    expireManyIn: expireManyIn.call(self, collectionName),
    expireManyNow: expireManyNow.call(self, collectionName),
    forgetMany: forgetMany.call(self, collectionName),
    getMany: getMany.call(self, collectionName),
    insertMany: insertMany.call(self, collectionName),
    replaceMany: replaceMany.call(self, collectionName),
    repsertMany: repsertMany.call(self, collectionName),
    restoreMany: restoreMany.call(self, collectionName),
    updateMany: updateMany.call(self, collectionName),
    upsertMany: upsertMany.call(self, collectionName),
    dropMany: dropMany.call(self, collectionName),
  };
};
