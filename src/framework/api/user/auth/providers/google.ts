import {
  DBFrameworkAuthConnectUrlOptions,
  DBFrameworkAuthAuthenticateOptions,
  DBFrameworkAuthAuthenticateResponse,
  DBFrameworkAuthTokenInfoOptions,
  DBFrameworkAuthUserInfoOptions,
  DBFrameworkAuthGetIdOptions,
} from "~/../types/framework/framework.user";
import { OAUTH2 } from "~/consts";
import { authenticate } from "~/framework/api/user/auth/authenticate";
import * as qs from "querystring";
import axios from "axios";

export const google = {
  connectUrl: function (options?: DBFrameworkAuthConnectUrlOptions) {
    let {
      client_id,
      scope = "openid profile email",
      state = {},
      redirect_uri,
      access_type = "offline",
      response_type = "code",
      prompt = "consent",
    } = options || {};
    let url = OAUTH2.GOOGLE.AUTHORIZE;
    let query: DBFrameworkAuthConnectUrlOptions = {
      client_id,
      scope,
      state,
      access_type,
      response_type,
      prompt,
    };
    if (redirect_uri) query.redirect_uri = redirect_uri;
    return `${url}?${qs.stringify(query as any)}`;
  },
  authenticate: async function (options?: DBFrameworkAuthAuthenticateOptions): Promise<DBFrameworkAuthAuthenticateResponse> {
    let { client_id, client_secret, code, redirect_uri, grant_type = "authorization_code" } = options || {};
    let url = OAUTH2.GOOGLE.ACCESS_TOKEN;
    let data: DBFrameworkAuthAuthenticateOptions = {
      client_id,
      client_secret,
      code,
      grant_type,
    };
    if (redirect_uri) data.redirect_uri = redirect_uri;
    return authenticate(url, data);
  },
  tokenInfo: async function (options: DBFrameworkAuthTokenInfoOptions) {
    return axios
      .get(OAUTH2.GOOGLE.TOKEN_INFO, {
        headers: {
          Authorization: `Bearer ${options.access_token}`,
        },
      })
      .then(({ data }) => data);
  },
  userInfo: async function (options: DBFrameworkAuthUserInfoOptions) {
    return axios
      .get(OAUTH2.GOOGLE.USER_INFO, {
        headers: {
          Authorization: `Bearer ${options.access_token}`,
        },
      })
      .then(({ data }) => data);
  },
  userId: async function (options: DBFrameworkAuthGetIdOptions) {
    return this.userInfo(options).then(({ sub }) => sub);
  },
};
