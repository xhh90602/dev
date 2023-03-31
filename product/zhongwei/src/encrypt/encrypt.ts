import md5 from 'crypto-js/md5';
import aes from 'crypto-js/aes';
import utf8Enc from 'crypto-js/enc-utf8';
import zeroPadding from 'crypto-js/pad-zeropadding';
import JSEncrypt from 'jsencrypt';

/**
 *
 * @param pk RSA公钥
 */
function createAESKey(pk: string) {
  // 通过 MD5 生成一个随机AES key
  const random = `${Date.now()}${Math.round(Math.random() * 10000)}`;
  const aesKey = md5(random).toString();
  // RSA 加密 MD5 随机串
  const rsaEncrypt = new JSEncrypt();
  rsaEncrypt.setPublicKey(pk);
  const encryptStr = rsaEncrypt.encrypt(aesKey); // 加密
  // 发送至服务器的base64编码后的加密串
  return {
    head: utf8Enc.parse(aesKey.substring(0, 16)),
    tail: utf8Enc.parse(aesKey.substring(16, aesKey.length)),
    postKey: encryptStr, // base64
  };
}

function encrypt(data: string, key: string, iv: string) {
  return aes.encrypt(utf8Enc.parse(data), key, {
    iv,
    padding: zeroPadding,
  }).toString();
}

function decrypt(data: string, key: string, iv: string) {
  const rs = aes.decrypt(data, key, {
    iv,
    padding: zeroPadding,
  });
  return utf8Enc.stringify(rs);
}

export default class Security {
  public readonly postKey: string | boolean;

  public respKey: string | undefined;

  private readonly head: string;

  private readonly tail: string;

  constructor(pk: string) {
    const { head, tail, postKey } = createAESKey(pk);
    // console.log(postKey,'postKeypostKeypostKeypostKey'); //公钥
    this.postKey = postKey;
    this.head = head;
    this.tail = tail;
  }

  public encrypt(data: string) {
    return encrypt(data, this.head, this.tail);
  }

  public decrypt(data: string) {
    return decrypt(data, this.head, this.tail);
  }
}
