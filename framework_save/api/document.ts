import { FrameworkDocumentApi } from '~/../types/framework/framework.document';
import { activity } from '~/framework/api/document/activity';
import { delete_ } from '~/framework/api/document/delete';
import { forget } from '~/framework/api/document/forget';
import { get } from '~/framework/api/document/get';
import { replace } from '~/framework/api/document/replace';
import { repsert } from '~/framework/api/document/repsert';
import { update } from '~/framework/api/document/update';
import { upsert } from '~/framework/api/document/upsert';
import { FaunaId } from '~/../types/fauna';

export function document(collectionName: string, id: FaunaId): FrameworkDocumentApi {
  const self = this;

  if (!(collectionName && id)) {
    throw new Error('biota.document() - no valid collection or id');
  }

  return {
    activity: activity.call(self, collectionName, id),
    get: get.call(self, collectionName, id),
    replace: replace.call(self, collectionName, id),
    update: update.call(self, collectionName, id),
    repsert: repsert.call(self, collectionName, id),
    upsert: upsert.call(self, collectionName, id),
    delete: delete_.call(self, collectionName, id),
    forget: forget.call(self, collectionName, id),
    async changes() {},
  };
}
