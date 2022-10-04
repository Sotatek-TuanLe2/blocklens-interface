import AppRequest from './AppRequest';
import AuthRequest from './AuthRequest';
import UserRequest from './UserRequest';
import RegistrationRequest from './RegistrationRequest';
import NotificationRequest from './NotificationRequest';
import BillingRequest from './BillingRequest';

const requestMap = {
  AppRequest,
  AuthRequest,
  UserRequest,
  RegistrationRequest,
  NotificationRequest,
  BillingRequest
};

const instances = {};

export default class RequestFactory {
  static getRequest(classname: string) {
    // @ts-ignore
    const RequestClass = requestMap[classname];
    if (!RequestClass) {
      throw new Error(`Invalid request class name: ${classname}`);
    }

    // @ts-ignore
    let requestInstance = instances[classname];
    if (!requestInstance) {
      requestInstance = new RequestClass();
      // @ts-ignore
      instances[classname] = requestInstance;
    }

    return requestInstance;
  }
}
