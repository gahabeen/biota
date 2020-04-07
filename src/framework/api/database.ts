import { DBFrameworkDatabaseApi } from "~/../types/framework/framework.database";
import { activity } from "~/framework/api/database/activity";
import { delete_ } from "~/framework/api/database/delete";
import { forget } from "~/framework/api/database/forget";
import { get } from "~/framework/api/database/get";
import { replace } from "~/framework/api/database/replace";
import { repsert } from "~/framework/api/database/repsert";
import { update } from "~/framework/api/database/update";
import { upsert } from "~/framework/api/database/upsert";
import { FaunaId } from "~/../types/fauna";

export function database(collectionName: string): DBFrameworkDatabaseApi {
  let self = this;

  if (!(collectionName)) {
    throw new Error("biota.database() - no valid collection or id");
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
