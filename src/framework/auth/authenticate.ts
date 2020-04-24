import { FrameworkAuthAuthenticateResponse } from '~/types/framework/framework.user';
// import * as qs from 'querystring';
import fetch from 'node-fetch';

export async function authenticate(url: string, query: object): Promise<FrameworkAuthAuthenticateResponse> {
  const params = new URLSearchParams();
  for (const key of Object.keys(query)) {
    params.append(key, query[key]);
  }
  return fetch(url, {
    method: 'POST',
    body: params as any,
  })
    .then((res) => res.json())
    .then(({ data }) => {
      if (typeof data === 'string') {
        return;
        // return qs.parse(data);
      } else {
        return data;
      }
    }) as Promise<FrameworkAuthAuthenticateResponse>;
}
