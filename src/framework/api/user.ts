import { query as q } from "faunadb";
import { DBFrameworkUserApi } from "~/../types/framework/framework.user";
import { DB } from "~/db";
import { user as userUDF } from "~/factory/api/udf/user";
import { document } from "~/factory/api/classes/document";
import { execute } from "~/tasks";
import { collectionNameNormalized } from "~/factory/classes/collection";

export const user: DBFrameworkUserApi = {
  async me(this: DB) {
    let self = this;
    return execute(
      [
        {
          name: `Get me`,
          task() {
            return self.query(q.Get(q.Select(["data", "_membership", "owner"], q.Get(q.Identity()))));
          },
        },
      ],
      {
        domain: "DB.user.me",
      }
    );
  },
  session: {
    get(this: DB) {
      let self = this;
      return execute(
        [
          {
            name: `Get session`,
            task() {
              return self.query(q.Get(q.Identity()));
            },
          },
        ],
        {
          domain: "DB.user.session.get",
        }
      );
    },
    async expireNow(this: DB) {
      let self = this;
      return execute(
        [
          {
            name: `Expire session now`,
            task() {
              return self.query(document.expireNow(collectionNameNormalized("user_sessions"), q.Select("id", q.Identity())));
            },
          },
        ],
        {
          domain: "DB.user.session.expireNow",
        }
      );
    },
    async expireIn(this: DB, delayInMs) {
      let self = this;
      return execute(
        [
          {
            name: `Expire session in [${delayInMs}]ms`,
            task() {
              return self.query(document.expireIn(collectionNameNormalized("user_sessions"), q.Select("id", q.Identity()), delayInMs));
            },
          },
        ],
        {
          domain: "DB.user.session.expireIn",
        }
      );
    },
    async expireAt(this: DB, at) {
      let self = this;
      return execute(
        [
          {
            name: `Expire session at [${at}]`,
            task() {
              return self.query(document.expireAt(collectionNameNormalized("user_sessions"), q.Select("id", q.Identity()), at));
            },
          },
        ],
        {
          domain: "DB.user.session.expireAt",
        }
      );
    },
    async update(this: DB, data = {}) {
      let self = this;
      return execute(
        [
          {
            name: `Update session data`,
            task() {
              return self.query(document.update(collectionNameNormalized("user_sessions"), q.Select("id", q.Identity()), data));
            },
          },
        ],
        {
          domain: "DB.user.session.update",
        }
      );
    },
    async replace(this: DB, data = {}) {
      let self = this;
      return execute(
        [
          {
            name: `Replace session data`,
            task() {
              return self.query(document.replace(collectionNameNormalized("user_sessions"), q.Select("id", q.Identity()), data));
            },
          },
        ],
        {
          domain: "DB.user.session.replace",
        }
      );
    },
    async delete(this: DB) {
      let self = this;
      return execute(
        [
          {
            name: `Delete session`,
            task() {
              return self.query(document.delete(collectionNameNormalized("user_sessions"), q.Select("id", q.Identity())));
            },
          },
        ],
        {
          domain: "DB.user.session.delete",
        }
      );
    },
    async forget(this: DB) {
      let self = this;
      return execute(
        [
          {
            name: `Forget session`,
            task() {
              return self.query(document.forget(collectionNameNormalized("user_sessions"), q.Select("id", q.Identity())));
            },
          },
        ],
        {
          domain: "DB.user.session.forget",
        }
      );
    },
  },
  async login(this: DB, email, password) {
    let self = this;
    return execute(
      [
        {
          name: `Login for [${email}]`,
          task() {
            return self.query(userUDF.login(email, password)).then(({ secret }) => {
              if (secret) return new DB({ secret });
              else return self;
            });
          },
        },
      ],
      {
        domain: "DB.user.login",
      }
    );
  },
  async register(this: DB, email, password, data = {}) {
    let self = this;
    return execute(
      [
        {
          name: `Register for [${email}]`,
          task() {
            return self.query(userUDF.register(email, password, data)).then((res) => {
              console.log("res", res);
              let { secret } = res;
              if (secret) return new DB({ secret });
              else return self;
            });
          },
        },
      ],
      {
        domain: "DB.user.register",
      }
    );
  },
  async changePassword(this: DB, newPassword) {
    let self = this;
    return execute(
      [
        {
          name: `Change password for current user`,
          task() {
            return self.query(userUDF.changePassword(newPassword));
          },
        },
      ],
      {
        domain: "DB.user.login",
      }
    );
  },
  async logout(this: DB, everywhere) {
    let self = this;
    return execute(
      [
        {
          name: `Logout`,
          task() {
            return self.query(q.Logout(everywhere));
          },
        },
      ],
      {
        domain: "DB.user.logout",
      }
    );
  },
  google: {
    async login(this: DB) {},
    async register(this: DB) {},
    async sync(this: DB) {},
  },
  github: {
    async login(this: DB) {},
    async register(this: DB) {},
    async sync(this: DB) {},
  },
};
