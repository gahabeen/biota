import { FrameworkUDFunctionApi } from '~/../types/framework/framework.udfunction';
import { activity } from '~/framework/api/udfunction/activity';
import { delete_ } from '~/framework/api/udfunction/delete';
import { forget } from '~/framework/api/udfunction/forget';
import { get } from '~/framework/api/udfunction/get';
import { replace } from '~/framework/api/udfunction/replace';
import { repsert } from '~/framework/api/udfunction/repsert';
import { update } from '~/framework/api/udfunction/update';
import { upsert } from '~/framework/api/udfunction/upsert';
import { FaunaId } from '~/../types/fauna';

export function udfunction(collectionName: string): FrameworkUDFunctionApi {
  const self = this;

  if (!collectionName) {
    throw new Error('biota.udfunction() - no valid collection or id');
  }

  return {
    activity: activity.call(self, collectionName),
    get: get.call(self, collectionName),
    replace: replace.call(self, collectionName),
    update: update.call(self, collectionName),
    repsert: repsert.call(self, collectionName),
    upsert: upsert.call(self, collectionName),
    delete: delete_.call(self, collectionName),
    forget: forget.call(self, collectionName),
    async changes() {},
  };
}
