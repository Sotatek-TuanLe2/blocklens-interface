import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class RegistrationRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.baseUrlApi;
  }

  getNFTActivity(params: any) {
    const url = `/my/registrations/nft-activity`;
    return this.get(url, params);
  }

  addNFTActivity(params: any) {
    const url = `/my/registrations/nft-activity`;
    return this.post(url, params);
  }

  getAddressActivity(params: any) {
    const url = `/my/registrations/address-activity`;
    return this.get(url, params);
  }

  addAddressActivity(params: any) {
    const url = `/my/registrations/address-activity`;
    return this.post(url, params);
  }
}
