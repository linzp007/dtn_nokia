import CryptoJS from 'crypto-js'
/**
 * 后端生成
 *  key: qwertyuiop@12345
 *  iv: 43720ui239062387
 */
const KEY = CryptoJS.enc.Utf8.parse("qwertyuiop@12345");
const IV = CryptoJS.enc.Utf8.parse("43720ui239062387");
export function Encrypt (password) {
  let srcs = CryptoJS.enc.Utf8.parse(password);
  let encrypted = CryptoJS.AES.encrypt(srcs, KEY, { iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}