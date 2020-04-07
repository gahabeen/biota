import { DBFrameworkRoleApi } from "~/../types/framework/framework.role";
import { activity } from "~/framework/api/role/activity";
import { delete_ } from "~/framework/api/role/delete";
import { forget } from "~/framework/api/role/forget";
import { get } from "~/framework/api/role/get";
import { replace } from "~/framework/api/role/replace";
import { repsert } from "~/framework/api/role/repsert";
import { update } from "~/framework/api/role/update";
import { upsert } from "~/framework/api/role/upsert";

export function role(collectionName: string): DBFrameworkRoleApi {
  let self = this;

  if (!collectionName) {
    throw new Error("biota.role() - no valid collection or id");
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
