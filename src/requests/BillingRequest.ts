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

  getBillingInfo() {
    const url = '/my/payment/billing-info';
    return this.get(url);
  }

  updateBillingInfo(params: any) {
    const url = '/my/payment/billing-info';
    return this.put(url, params);
  }

  getCurrentPlan() {
    const url = '/my/billing-plans/plan';
    return this.get(url);
  }

  getPaymentIntent() {
    const url = '/my/payment/setup-payment-intent';
    return this.get(url);
  }

  attachPaymentMethod(params: { paymentMethodId: string }) {
    const url = '/my/payment/attach-payment-method';
    return this.put(url, params);
  }

  updateBillingPlan(params: { code: string }) {
    const url = '/my/billing-plans/plan';
    return this.put(url, params);
  }

  cancelSubscription() {
    const url = '/my/billing-plans/cancel-subscription';
    return this.put(url);
  }

  getInvoiceList(params: any) {
    const url = '/my/payment/invoice';
    return this.get(url, { ...params });
  }

  downloadInvoice(type: string, id: string) {
    const url = `/my/payment/download-${type}`;
    return this.get(url, { id });
  }
}
