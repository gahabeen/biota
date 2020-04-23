import fetch from 'node-fetch';
import { OAUTH2 } from '~/consts';
import { authenticate } from '~/framework/auth/authenticate';
import * as qs from '~/helpers/querystring';
import {
  FrameworkAuthAuthenticateOptions,
  FrameworkAuthAuthenticateResponse,
  FrameworkAuthConnectUrlOptions,
  FrameworkAuthGetIdOptions,
  FrameworkAuthTokenInfoOptions,
  FrameworkAuthUserInfoOptions,
} from '~/types/framework/framework.user';

export const google = {
  connectUrl(options?: FrameworkAuthConnectUrlOptions) {
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
  async authenticate(options?: FrameworkAuthAuthenticateOptions): Promise<FrameworkAuthAuthenticateResponse> {
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
  async tokenInfo(options: FrameworkAuthTokenInfoOptions) {
    return fetch(OAUTH2.GOOGLE.TOKEN_INFO, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${options.access_token}`,
      },
    })
      .then((res) => res.json())
      .then(({ data }) => data);
  },
  async userInfo(options: FrameworkAuthUserInfoOptions) {
    return fetch(OAUTH2.GOOGLE.USER_INFO, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${options.access_token}`,
      },
    })
      .then((res) => res.json())
      .then(({ data }) => data);
  },
  async userId(options: FrameworkAuthGetIdOptions) {
    return this.userInfo(options).then(({ sub }) => sub);
  },
};
