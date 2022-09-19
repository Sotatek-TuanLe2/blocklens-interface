/* eslint-disable @typescript-eslint/no-explicit-any */
import prod from './prod.json';
import dev from './dev.json';

const env = process.env.REACT_APP_ENV || 'prod';
const configs: any = { prod, dev };
const config: Config = configs[env];

export interface Config {
  auth: {
    domain: string;
    message: string;
    secretKey: string;
  };
  api: {
    baseUrlApi: string;
  };
}

export default config;
