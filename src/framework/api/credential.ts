import { activity } from '~/framework/api/credential/activity';
import { drop } from '~/framework/api/credential/drop';
import { forget } from '~/framework/api/credential/forget';
import { get } from '~/framework/api/credential/get';
import { insert } from '~/framework/api/credential/insert';
import { replace } from '~/framework/api/credential/replace';
import { repsert } from '~/framework/api/credential/repsert';
import { update } from '~/framework/api/credential/update';
import { FrameworkCredential } from '~/types/framework/framework.credential';

export const credential: FrameworkCredential = (idOrRefOrInstance) => {
  const self = this;

  return {
    activity: activity.call(self, idOrRefOrInstance),
    get: get.call(self, idOrRefOrInstance),
    insert: insert.call(self, idOrRefOrInstance),
    replace: replace.call(self, idOrRefOrInstance),
    update: update.call(self, idOrRefOrInstance),
    repsert: repsert.call(self, idOrRefOrInstance),
    forget: forget.call(self, idOrRefOrInstance),
    drop: drop.call(self, idOrRefOrInstance),
  };
};
