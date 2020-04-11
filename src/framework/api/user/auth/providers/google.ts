import {
  DBFrameworkAuthConnectUrlOptions,
  DBFrameworkAuthAuthenticateOptions,
  DBFrameworkAuthAuthenticateResponse,
  DBFrameworkAuthTokenInfoOptions,
  DBFrameworkAuthUserInfoOptions,
  DBFrameworkAuthGetIdOptions,
} from '~/../types/framework/framework.user';
import { OAUTH2 } from '~/consts';
import { authenticate } from '~/framework/api/user/auth/authenticate';
import axios from 'axios';
import * as qs from '~/helpers/querystring';

export const google = {
  connectUrl: function (options?: DBFrameworkAuthConnectUrlOptions) {
    const {
      client_id,
      scope = 'openid profile email',
      state = {},
      redirect_uri,
      access_type = 'offline',
      response_type = 'code',
      prompt = 'consent',
    } = options || {};
    const url = OAUTH2.GOOGLE.AUTHORIZE;
    const query: DBFrameworkAuthConnectUrlOptions = {
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
    const { client_id, client_secret, code, redirect_uri, grant_type = 'authorization_code' } = options || {};
    const url = OAUTH2.GOOGLE.ACCESS_TOKEN;
    const query: DBFrameworkAuthAuthenticateOptions = {
      client_id,
      client_secret,
      code,
      grant_type,
    };
    if (redirect_uri) query.redirect_uri = redirect_uri;
    return authenticate(url, query);
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
