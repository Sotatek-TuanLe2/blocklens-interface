import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class RegistrationRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.baseUrlApi;
  }

  getRegistrations(appId: string, params: any) {
    const url = `/registrations/app-${appId}`;
    return this.get(url, params);
  }

  addRegistrations(appId: string, params: any) {
    const url = `/registrations/app-${appId}`;
    return this.post(url, params);
  }

  updateStatus(appId: string, registrationId: string, params: any) {
    const url = `/registrations/${registrationId}`;
    return this.patch(url, params);
  }

  deleteRegistration(appId: string, registrationId: string) {
    const url = `/registrations/${registrationId}`;
    return this.delete(url);
  }

  getRegistration(appId: string, registrationId: any) {
    const url = `/registrations/${registrationId}`;
    return this.get(url);
  }

  getContractABI(address: string) {
    const url = `/api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=3CVYQVYCIFFT6VM8W3IZCPDKUYJMU23WRY`;
    return this.get(url);
  }
}
