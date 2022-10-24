import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class RegistrationRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.baseUrlApi;
  }

  getWebhookDetail(type: string, registrationId: string) {
    const url = `/my/registrations/${type}/${registrationId}`;
    return this.get(url);
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

  getContractActivity(params: any) {
    const url = `/my/registrations/contract-activity`;
    return this.get(url, params);
  }

  addContractActivity(params: any) {
    const url = `/my/registrations/contract-activity`;
    return this.post(url, params);
  }
}
