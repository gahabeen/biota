import { FrameworkAuthAuthenticateResponse } from '~/../types/framework/framework.user';
import * as qs from 'querystring';
import axios from 'axios';

export async function authenticate(url: string, query: object): Promise<FrameworkAuthAuthenticateResponse> {
  const queryParams = new URLSearchParams();
  for (const key of Object.keys(query)) {
    queryParams.append(key, query[key]);
  }
  return axios
    .post(url, queryParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(({ data }) => {
      if (typeof data === 'string') {
        return qs.parse(data);
      } else {
        return data;
      }
    }) as Promise<FrameworkAuthAuthenticateResponse>;
}
