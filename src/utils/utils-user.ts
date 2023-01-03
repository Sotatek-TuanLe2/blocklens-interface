export interface StripePayment {
  card: any;
  id: string;
  livemode: boolean;
}
export interface UserInterface {
  id: string;
  balance: string;
  billingEmail: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  linkedAddress: string;
  stripePayment: StripePayment;
  isPaymentMethodIntegrated: boolean;

  setId: (id: string) => void;
  setBalance: (balance: string) => void;
  setBillingEmail: (billingEmail: string) => void;
  setEmail: (email: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setIsEmailVerified: (isEmailVerified: boolean) => void;
  setIsPaymentMethodIntegrated: (isPaymentMethodIntegrated: boolean) => void;
  setLinkedAddress: (linkedAddress: string) => void;
  setStripePayment: (stripePayment: StripePayment) => void;
  getId: () => string;
  getBalance: () => string;
  getBillingEmail: () => string;
  getEmail: () => string;
  getFirstName: () => string;
  getLastName: () => string;
  getIsEmailVerified: () => boolean;
  getLinkedAddress: () => string;
  getStripePayment: () => StripePayment;
  isUserLinked: () => boolean;
  isUserStriped: () => boolean;
}

export class User implements UserInterface {
  public id = '';
  public balance = '';
  public billingEmail = '';
  public email = '';
  public firstName = '';
  public lastName = '';
  public isEmailVerified = false;
  public isPaymentMethodIntegrated = false;
  public linkedAddress = '';
  public stripePayment = {
    card: {},
    id: '',
    livemode: false,
  };

  constructor(id: string) {
    this.id = id;
  }

  setId(id: string): void {
    this.id = id;
  }

  setBalance(balance: string | number): void {
    this.balance = String(balance);
  }

  setBillingEmail(billingEmail: string): void {
    this.billingEmail = billingEmail;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setFirstName(firstName: string): void {
    this.firstName = firstName;
  }

  setLastName(lastName: string): void {
    this.lastName = lastName;
  }

  setIsEmailVerified(isEmailVerified: boolean): void {
    this.isEmailVerified = isEmailVerified;
  }

  setIsPaymentMethodIntegrated(isPaymentMethodIntegrated: boolean): void {
    this.isPaymentMethodIntegrated = isPaymentMethodIntegrated;
  }

  setLinkedAddress(linkedAddress: string): void {
    this.linkedAddress = linkedAddress;
  }

  setStripePayment(stripePayment: StripePayment): void {
    this.stripePayment = stripePayment;
  }

  getId(): string {
    return this.id;
  }

  getBalance(): string {
    return this.balance;
  }

  getBillingEmail(): string {
    return this.billingEmail;
  }

  getEmail(): string {
    return this.email;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getIsEmailVerified(): boolean {
    return this.isEmailVerified;
  }

  getLinkedAddress(): string {
    return this.linkedAddress;
  }

  getStripePayment(): StripePayment {
    return this.stripePayment;
  }

  isUserLinked(): boolean {
    return !!this.linkedAddress;
  }

  isUserStriped(): boolean {
    return !!this.stripePayment;
  }
}
