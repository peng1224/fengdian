const path = require('path');

module.exports = {
  WX_APPID: 'wxe720228a95e1525e',
  WX_SECRET: '3f9c918c766c173c531fff8d1b45cec5',
  WX_MCHID: '1720374769',
  WX_SERIAL_NO: '7166B152461EBE6A71EAAFB27D10A26D72792CA7',
  WX_V3_KEY: '02Zxcvbnm12Asdfghjkl24Qwertyuiop',
  CERT_PATHS: {
    cert: path.resolve(__dirname, 'certs/apiclient_cert.pem'),
    key: path.resolve(__dirname, 'certs/apiclient_key.pem'),
    platformCert: path.resolve(__dirname, 'certs/platform_cert.pem')
  },
  NOTIFY_URL: 'https://your.domain.com/payNotify'
};
