import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class BillingRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.baseUrlApi;
  }

  getPlans() {
    const url = '/public/plans';
    return this.get(url);
  }

  updateBillingInfo(params: any) {
    const url = '/my/payment/billing-info';
    return this.put(url, params);
  }

  getCurrentSubscription() {
    const url = '/my/subscriptions/current-subscription';
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
    const url = '/my/subscriptions';
    return this.put(url, params);
  }

  cancelSubscription() {
    const url = '/my/subscriptions/cancel-subscription';
    return this.put(url);
  }

  getInvoiceList(params: any) {
    const url = '/my/invoices';
    return this.get(url, { ...params });
  }

  downloadInvoice(type: string, id: string) {
    const url = `/my/payment/download-${type}?id=${id}`;
    return this.download(url);
  }

  retryPendingInvoice(id: string) {
    const url = `/my/subscriptions/retry-payment/invoice-${id}`;
    return this.put(url);
  }

  getListReceipt(receiptIds: string) {
    const url = `/my/receipts`;
    return this.get(url, { receiptIds });
  }

  /** For downgrading */

  /**
   * estimate price for renewing or downgrading subscription
   */
  estimatePriceForRenewOrDowngrade() {
    const url = '/subscription/estimate-renew-subscription-price';
    return this.get(url);
  }

  /**
   * purchase renewal or downgrade
   * call when checking transaction was confirmed successfully
   */
  purchaseRenewalOrDowngrade() {
    const url = '/subscription/purchase-renew-subscription';
    return this.put(url);
  }

  /**
   * downgrade subscription status
   * @param code required - plan
   */
  downgradeSubscription(code: string) {
    const url = '/subscription/downgrade';
    return this.post(url, { code });
  }

  /**
   * cancel downgrade
   */
  cancelDowngrade() {
    const url = '/subscription/cancel-downgrade';
    return this.post(url);
  }

  /**
   * get purchased subscription
   */
  getPurchasedSubscription() {
    const url = '/my/subscriptions/purchased-subscription';
    return this.get(url);
  }

  /** For upgrading */

  /**
   * estimate price for upgrading subscription
   * @param code required - plan
   * @param subscribeOptionCode - for yearly upgrading YEARLY_SUBSCRIPTION
   */
  estimatePriceForUpgrade(code: string, subscribeOptionCode?: string) {
    const url = '/subscription/estimate-upgrade-subscription-price';
    return this.put(url, { code, subscribeOptionCode });
  }

  /**
   * upgrade subscription status
   * @param code required - plan
   * @param subscribeOptionCode - for yearly upgrading YEARLY_SUBSCRIPTION
   */
  upgradeSubscription(code: string, subscribeOptionCode?: string) {
    const url = '/subscription/upgrade';
    return this.post(url, { code, subscribeOptionCode });
  }

  /** Checking transaction */

  /**
   * @param tx required
   * @param chain
   * @param network
   */
  checkPaymentTransaction(tx: string, chain: string, network: string) {
    const url = '/my/users/confim-topup-transaction';
    return this.get(url, { tx, chain, network });
  }
}
