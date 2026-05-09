import crypto from 'crypto'

export function buildStringToSign(
  method: string,
  uri: string,
  accessKey: string,
  dataType: string,
  signatureVersion: string,
  timestamp: string,
) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n')
}

export function sign(signString: string, accessSecret: string) {
  return crypto
    .createHmac('sha1', accessSecret)
    .update(Buffer.from(signString, 'utf-8'))
    .digest()
    .toString('base64')
}
