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
import * as qs from 'querystring';
import axios from 'axios';

export const github = {
  connectUrl: function (options?: FrameworkAuthConnectUrlOptions) {
    let { client_id, scope = 'read:user user:email', redirect_uri, state = {} } = options || {};
    let url = OAUTH2.GITHUB.AUTHORIZE;
    let query: FrameworkAuthConnectUrlOptions = {
      client_id,
      scope,
      state,
    };
    if (redirect_uri) query.redirect_uri = redirect_uri;
    return `${url}?${qs.stringify(query as any)}`;
  },
  authenticate: async function (options?: FrameworkAuthAuthenticateOptions): Promise<FrameworkAuthAuthenticateResponse> {
    let { client_id, client_secret, code } = options || {};
    let url = OAUTH2.GITHUB.ACCESS_TOKEN;
    let data: FrameworkAuthAuthenticateOptions = {
      client_id,
      client_secret,
      code,
    };
    return authenticate(url, data);
  },
  tokenInfo: async function (options: FrameworkAuthTokenInfoOptions) {},
  userInfo: async function (options: FrameworkAuthUserInfoOptions) {
    return axios
      .get(OAUTH2.GITHUB.USER_INFO, {
        headers: {
          Authorization: `Bearer ${options.access_token}`,
        },
      })
      .then(({ data }) => data);
  },
  userId: async function (options: FrameworkAuthGetIdOptions) {
    return this.userInfo(options).then(({ id }) => id);
  },
};
