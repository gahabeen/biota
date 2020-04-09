import { DBFrameworkIndexApi } from "~/../types/framework/framework.index";
import { delete_ } from "~/framework/api/index/delete";
import { forget } from "~/framework/api/index/forget";
import { get } from "~/framework/api/index/get";
import { insert } from "~/framework/api/index/insert";
import { replace } from "~/framework/api/index/replace";
import { repsert } from "~/framework/api/index/repsert";
import { update } from "~/framework/api/index/update";
import { upsert } from "~/framework/api/index/upsert";

export function index(indexName: string): DBFrameworkIndexApi {
  let self = this;

  if (!indexName) {
    throw new Error("biota.index() - no valid index name");
  }

  return {
    get: get.call(self, indexName),
    insert: insert.call(self, indexName),
    replace: replace.call(self, indexName),
    update: update.call(self, indexName),
    repsert: repsert.call(self, indexName),
    upsert: upsert.call(self, indexName),
    delete: delete_.call(self, indexName),
    forget: forget.call(self, indexName),
    async changes() {},
  };
}
