/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import Security from './encrypt';
import { publicKey } from './key';

// @ts-ignore
if (window.__security === undefined) {
  // @ts-ignore
  window.__security = new Security(publicKey);
}
// @ts-ignore
export const security = window.__security;

export function initEncryptKey(url: string, postKey: string) {
  return axios({
    method: 'POST',
    headers: { 'content-type': 'text/plain', Accept: 'application/json' },
    data: postKey,
    url: `${url}/gateway/security/getToken`,
  }).then((rs: any) => {
    // CacheSession.setItem('token',rs.data.result)
    const { result } = rs.data;
    return result;
  });
}
