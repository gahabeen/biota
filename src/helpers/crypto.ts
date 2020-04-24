// import * as crypto from 'crypto';

// export function encode(text: string) {
//   return new Buffer(text).toString('base64');
// }

// export function decode(base64Text: string) {
//   return new Buffer(base64Text, 'base64').toString('ascii');
// }

// export function encrypt(text: string, passphrase: string) {
//   const key = Buffer.from(passphrase);
//   const iv = crypto.randomBytes(16);
//   let c = crypto.createCipheriv('aes-256-cbc', key, iv);
//   let encrypted = c.update(text);
//   return {
//     iv: iv.toString('hex'),
//     encrypted: encrypted.toString('hex'),
//   };
// }

// export function decrypt(text: any, iv: any, passphrase: string) {
//   const parsedIv = Buffer.from(iv, 'hex');
//   const parsedText = Buffer.from(text, 'hex');
//   const key = Buffer.from(passphrase);
//   let dc = crypto.createDecipheriv('aes-256-cbc', key, parsedIv);
//   let decrypted = dc.update(parsedText);
//   return Buffer.concat([decrypted, dc.final()]).toString();
// }
