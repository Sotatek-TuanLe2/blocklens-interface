import BaseRequest from './BaseRequest';
import config from 'src/config';

export default class AptosRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.baseUrlApi;
  }

  getModules(address: string, resource: string) {
    const url = `/fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/resource/${resource}`;
    return this.get(url);
  }

  getABI(address: string, moduleName: string) {
    const url = `/fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/module/${moduleName}`;
    return this.get(url);
  }
}
