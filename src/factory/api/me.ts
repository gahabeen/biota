// types
import { DBFactoryMe } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { collection } from "~/factory/api/collection";

export const me: DBFactoryMe = {
  logout: function meLogout(everywhere) {
    return collection("users").logout(everywhere);
  },
  changePassword: function meChangePassword(password: string) {
    return collection("users").changePassword(password);
  },
  get: function meGet() {
    return collection("users").get(q.Select("id", q.Identity()));
  },
  update: function meUpdate(data) {
    return collection("users").update(q.Select("id", q.Identity()), data);
  },
  upsert: function meUpsert(data) {
    return collection("users").upsert(q.Select("id", q.Identity()), data);
  },
  delete: function meDelete() {
    return collection("users").delete(q.Select("id", q.Identity()));
  },
  forget: function meForget() {
    return collection("users").forget(q.Select("id", q.Identity()));
  }
};
