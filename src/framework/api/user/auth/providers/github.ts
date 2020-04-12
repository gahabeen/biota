import {
  BiotaFrameworkAuthConnectUrlOptions,
  BiotaFrameworkAuthAuthenticateOptions,
  BiotaFrameworkAuthAuthenticateResponse,
  BiotaFrameworkAuthTokenInfoOptions,
  BiotaFrameworkAuthUserInfoOptions,
  BiotaFrameworkAuthGetIdOptions,
} from '~/../types/framework/framework.user';
import { OAUTH2 } from '~/consts';
import { authenticate } from '~/framework/api/user/auth/authenticate';
import * as qs from 'querystring';
import axios from 'axios';

export const github = {
  connectUrl: function (options?: BiotaFrameworkAuthConnectUrlOptions) {
    let { client_id, scope = 'read:user user:email', redirect_uri, state = {} } = options || {};
    let url = OAUTH2.GITHUB.AUTHORIZE;
    let query: BiotaFrameworkAuthConnectUrlOptions = {
      client_id,
      scope,
      state,
    };
    if (redirect_uri) query.redirect_uri = redirect_uri;
    return `${url}?${qs.stringify(query as any)}`;
  },
  authenticate: async function (options?: BiotaFrameworkAuthAuthenticateOptions): Promise<BiotaFrameworkAuthAuthenticateResponse> {
    let { client_id, client_secret, code } = options || {};
    let url = OAUTH2.GITHUB.ACCESS_TOKEN;
    let data: BiotaFrameworkAuthAuthenticateOptions = {
      client_id,
      client_secret,
      code,
    };
    return authenticate(url, data);
  },
  tokenInfo: async function (options: BiotaFrameworkAuthTokenInfoOptions) {},
  userInfo: async function (options: BiotaFrameworkAuthUserInfoOptions) {
    return axios
      .get(OAUTH2.GITHUB.USER_INFO, {
        headers: {
          Authorization: `Bearer ${options.access_token}`,
        },
      })
      .then(({ data }) => data);
  },
  userId: async function (options: BiotaFrameworkAuthGetIdOptions) {
    return this.userInfo(options).then(({ id }) => id);
  },
};
