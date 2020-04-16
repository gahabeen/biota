import {
  FrameworkAuthConnectUrlOptions,
  FrameworkAuthAuthenticateOptions,
  FrameworkAuthAuthenticateResponse,
  FrameworkAuthTokenInfoOptions,
  FrameworkAuthUserInfoOptions,
  FrameworkAuthGetIdOptions,
} from '~/../types/framework/framework.user';
import { OAUTH2 } from '~/consts';
import { authenticate } from '~/framework/api/user/auth/authenticate';
import axios from 'axios';
import * as qs from '~/helpers/querystring';

export const google = {
  connectUrl: function (options?: FrameworkAuthConnectUrlOptions) {
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
    const query: FrameworkAuthConnectUrlOptions = {
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
  authenticate: async function (options?: FrameworkAuthAuthenticateOptions): Promise<FrameworkAuthAuthenticateResponse> {
    const { client_id, client_secret, code, redirect_uri, grant_type = 'authorization_code' } = options || {};
    const url = OAUTH2.GOOGLE.ACCESS_TOKEN;
    const query: FrameworkAuthAuthenticateOptions = {
      client_id,
      client_secret,
      code,
      grant_type,
    };
    if (redirect_uri) query.redirect_uri = redirect_uri;
    return authenticate(url, query);
  },
  tokenInfo: async function (options: FrameworkAuthTokenInfoOptions) {
    return axios
      .get(OAUTH2.GOOGLE.TOKEN_INFO, {
        headers: {
          Authorization: `Bearer ${options.access_token}`,
        },
      })
      .then(({ data }) => data);
  },
  userInfo: async function (options: FrameworkAuthUserInfoOptions) {
    return axios
      .get(OAUTH2.GOOGLE.USER_INFO, {
        headers: {
          Authorization: `Bearer ${options.access_token}`,
        },
      })
      .then(({ data }) => data);
  },
  userId: async function (options: FrameworkAuthGetIdOptions) {
    return this.userInfo(options).then(({ sub }) => sub);
  },
};
