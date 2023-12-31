import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class RegistrationRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.baseUrlApi;
  }

  getWebhookWithoutAppStatsOfUser() {
    const url = '/registrations/stats/without-projectId';
    return this.get(url);
  }

  getRegistrations(projectId: string, params: any) {
    const url = `/registrations/project-${projectId}`;
    return this.get(url, params);
  }

  getRegistrationsWithoutApp(params: any) {
    const url = `/registrations/without-projectId`;
    return this.get(url, params);
  }

  addRegistrations(projectId: string, params: any) {
    const url = `/registrations/project-${projectId}`;
    return this.post(url, params);
  }

  addRegistrationWithoutApp(params: any) {
    const url = `/registrations/without-projectId`;
    return this.post(url, params);
  }

  updateStatus(registrationId: string, params: any) {
    const url = `/registrations/${registrationId}`;
    return this.patch(url, params);
  }

  deleteRegistration(registrationId: string) {
    const url = `/registrations/${registrationId}`;
    return this.delete(url);
  }

  getRegistration(registrationId: string) {
    const url = `/registrations/${registrationId}`;
    return this.get(url);
  }

  getContractABI(address: string) {
    const url = `/api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=3CVYQVYCIFFT6VM8W3IZCPDKUYJMU23WRY`;
    return this.get(url);
  }

  sendDemoWebhook(params: {
    chain: string;
    network: string;
    type: string;
    webhook: string;
  }) {
    const url = '/registrations/test-webhook';
    return this.post(url, params);
  }
}
