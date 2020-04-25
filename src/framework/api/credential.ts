import { Biota } from '~/biota';
import { activity } from '~/framework/api/credential/activity';
import { drop } from '~/framework/api/credential/drop';
import { forget } from '~/framework/api/credential/forget';
import { get } from '~/framework/api/credential/get';
import { insert } from '~/framework/api/credential/insert';
import { replace } from '~/framework/api/credential/replace';
import { repsert } from '~/framework/api/credential/repsert';
import { update } from '~/framework/api/credential/update';
import { FrameworkCredential } from '~/types/framework/framework.credential';

export const credential: FrameworkCredential = function (this: Biota, idOrInstance) {
  return {
    activity: activity.call(this, idOrInstance),
    get: get.call(this, idOrInstance),
    insert: insert.call(this, idOrInstance),
    replace: replace.call(this, idOrInstance),
    update: update.call(this, idOrInstance),
    repsert: repsert.call(this, idOrInstance),
    forget: forget.call(this, idOrInstance),
    drop: drop.call(this, idOrInstance),
  };
};
