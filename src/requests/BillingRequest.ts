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

  getPaymentMethod() {
    const url = '/my/billing-plans/payment-method';
    return this.get(url);
  }

  confirmPaymentMethod(params: { paymentMethodId : string }) {
    const url = '/my/billing-plans/payment-method/confirm';
    return this.put(url, params);
  }

  updateBillingPlan(params: { code : string }) {
    const url = '/my/billing-plans/update-billing-plan';
    return this.put(url, params);
  }

  getInvoiceList(params: any) {
    const url = '/my/billing-plans/invoice';
    return this.get(url, { ...params });
  }
}
