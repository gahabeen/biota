import * as auth from "~/framework/api/auth";

export const user = {
  google() {
    return {
      login() {

      },
      signup() {},
      register() {},
      sync() {}
    };
  },
  github() {
    return {
      login() {},
      signup() {},
      register() {},
      sync() {}
    };
  },
  logout() {}
};
