import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class BillingRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.baseUrlApi;
  }

  getBillingPlans() {
    const url = '/public/billing-plans';
    return this.get(url);
  }

  getCurrentPlan() {
    const url = '/my/billing-plans/current-plan';
    return this.get(url);
  }

  getPaymentIntent() {
    const url = '/my/billing-plans/payment-intent';
    return this.get(url);
  }
}
