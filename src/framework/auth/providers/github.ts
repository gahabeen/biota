import axios from 'axios';
import * as qs from 'querystring';
import { OAUTH2 } from '~/consts';
import { authenticate } from '~/framework/auth/authenticate';
import {
  FrameworkAuthAuthenticateOptions,
  FrameworkAuthAuthenticateResponse,
  FrameworkAuthConnectUrlOptions,
  FrameworkAuthGetIdOptions,
  FrameworkAuthTokenInfoOptions,
  FrameworkAuthUserInfoOptions,
} from '~/types/framework/framework.user';

export const github = {
  connectUrl(options?: FrameworkAuthConnectUrlOptions) {
    const { client_id, scope = 'read:user user:email', redirect_uri, state = {} } = options || {};
    const url = OAUTH2.GITHUB.AUTHORIZE;
    const query: FrameworkAuthConnectUrlOptions = {
      client_id,
      scope,
      state,
    };
    if (redirect_uri) query.redirect_uri = redirect_uri;
    return `${url}?${qs.stringify(query as any)}`;
  },
  async authenticate(options?: FrameworkAuthAuthenticateOptions): Promise<FrameworkAuthAuthenticateResponse> {
    const { client_id, client_secret, code } = options || {};
    const url = OAUTH2.GITHUB.ACCESS_TOKEN;
    const data: FrameworkAuthAuthenticateOptions = {
      client_id,
      client_secret,
      code,
    };
    return authenticate(url, data);
  },
  tokenInfo(options: FrameworkAuthTokenInfoOptions) {},
  async userInfo(options: FrameworkAuthUserInfoOptions) {
    return axios
      .get(OAUTH2.GITHUB.USER_INFO, {
        headers: {
          Authorization: `Bearer ${options.access_token}`,
        },
      })
      .then(({ data }) => data);
  },
  async userId(options: FrameworkAuthGetIdOptions) {
    return this.userInfo(options).then(({ id }) => id);
  },
};
