import {
  StripePayment,
  UserAuthType,
  UserBillingType,
  UserInfoType,
  UserPaymentType,
  UserPlanType,
  UserSettingsType,
  UserState,
  UserStatsType,
} from 'src/store/user';
export interface UserInterface {
  id: string;
  auth: UserAuthType;
  info: UserInfoType;
  stats: UserStatsType;
  billing: UserBillingType;
  settings: UserSettingsType;

  setId: (id: string) => void;
  setAuth: (auth: UserAuthType) => void;
  setInfo: (info: UserInfoType) => void;
  setStats: (stats: UserStatsType) => void;
  setBilling: (billing: UserBillingType) => void;
  setPlan: (plan: UserPlanType) => void;
  setNextPlan: (plan: UserPlanType) => void;
  setPayment: (payment: UserPaymentType) => void;
  setSettings: (settings: UserSettingsType) => void;

  getId: () => string;
  getAuth: () => UserAuthType;
  getInfo: () => UserInfoType;
  getStats: () => UserStatsType;
  getBilling: () => UserBillingType;
  getPlan: () => UserPlanType;
  getNextPlan: () => UserPlanType;
  getPayment: () => UserPaymentType;
  getSettings: () => UserSettingsType;

  getEmail: () => string;
  getBillingEmail: () => string;
  getFirstName: () => string;
  getLastName: () => string;

  getBalance: () => number;
  getLinkedAddresses: () => string[];
  getStripePayment: () => StripePayment;
  getActivePaymentMethod: () => string;

  isEmailVerified: () => boolean;
  isUserLinked: () => boolean;
  isUserStriped: () => boolean;
  isPaymentMethodIntegrated: () => boolean;
  isNotificationEnabled: () => boolean;
  isLoginViaEmail: () => boolean;
}

export class User implements UserInterface {
  public id = '';
  public auth: UserAuthType = {
    accessToken: '',
    refreshToken: '',
  };
  public info: UserInfoType = {
    authProviders: [],
    email: '',
    firstName: '',
    lastName: '',
  };
  public stats: UserStatsType = {
    numberOfAddressActivities: 0,
    numberOfContractActivities: 0,
    numberOfNftActivities: 0,
    totalProject: 0,
    totalProjectActive: 0,
    totalProjectInActive: 0,
    totalRegistration: 0,
    totalRegistrationActive: 0,
    totalRegistrationWithoutAppId: 0,
    totalRegistrationActiveWithoutAppId: 0,
  };
  public billing: UserBillingType = {
    plan: {
      code: 'PLAN1',
      name: 'STARTER',
      description:
        'Features:\n    • 2 projects\n    • 100 messages/day\n    • 24/7 Telegram support (Response time < 72 hours)\n    ',
      price: 0,
      currency: '',
      from: 0,
      to: 0,
      capacity: {
        cu: 1000000,
        project: 2,
      },
      createdAt: '',
      updatedAt: '',
      notificationLimitation: 0,
    },
    nextPlan: {
      code: 'PLAN1',
      name: 'STARTER',
      description:
        'Features:\n    • 2 projects\n    • 100 messages/day\n    • 24/7 Telegram support (Response time < 72 hours)\n    ',
      price: 0,
      currency: '',
      from: 0,
      to: 0,
      capacity: {
        cu: 1000000,
        project: 2,
      },
      createdAt: '',
      updatedAt: '',
      notificationLimitation: 0,
    },
    payment: {
      activePaymentMethod: 'STRIPE',
      balance: 0,
      isPaymentMethodIntegrated: false,
      stripePaymentMethod: {
        card: {},
        id: '',
        livemode: false,
      },
      walletAddresses: [],
    },
  };
  public settings: UserSettingsType = {
    notificationEnabled: false,
  };

  constructor(user: UserState) {
    this.id = user.userId;
    this.auth = user.auth;
    this.info = user.info;
    this.stats = user.stats;
    this.billing = user.billing;
    this.settings = user.settings;
  }

  setId(id: string): void {
    this.id = id;
  }

  setAuth(auth: UserAuthType): void {
    this.auth = auth;
  }

  setInfo(info: UserInfoType): void {
    this.info = info;
  }

  setStats(stats: UserStatsType): void {
    this.stats = stats;
  }

  setBilling(billing: UserBillingType): void {
    this.billing = billing;
  }

  setPlan(plan: UserPlanType): void {
    this.billing.plan = plan;
  }

  setNextPlan(nextPlan: UserPlanType): void {
    this.billing.nextPlan = nextPlan;
  }

  setPayment(payment: UserPaymentType): void {
    this.billing.payment = payment;
  }

  setSettings(settings: UserSettingsType): void {
    this.settings = settings;
  }

  getId(): string {
    return this.id;
  }
  getAuth(): UserAuthType {
    return this.auth;
  }

  getInfo(): UserInfoType {
    return this.info;
  }

  getStats(): UserStatsType {
    return this.stats;
  }

  getBilling(): UserBillingType {
    return this.billing;
  }

  getPlan(): UserPlanType {
    return this.billing.plan;
  }

  getNextPlan(): UserPlanType {
    return this.billing.nextPlan;
  }

  getPayment(): UserPaymentType {
    return this.billing.payment;
  }

  getSettings(): UserSettingsType {
    return this.settings;
  }

  getEmail(): string {
    return this.info.email;
  }

  getBillingEmail(): string {
    return this.settings.billingEmail || '';
  }

  getFirstName(): string {
    return this.info.firstName;
  }

  getLastName(): string {
    return this.info.lastName;
  }

  getAuthProviders(): string[] {
    return this.info.authProviders;
  }

  getBalance(): number {
    return this.billing.payment.balance;
  }

  getLinkedAddresses(): string[] {
    return this.billing.payment.walletAddresses;
  }

  getStripePayment(): StripePayment {
    return this.billing.payment.stripePaymentMethod;
  }

  getActivePaymentMethod(): string {
    return this.billing.payment.activePaymentMethod;
  }

  isEmailVerified(): boolean {
    return !!this.info.isEmailVerified;
  }

  isUserLinked(): boolean {
    return !!this.billing.payment.walletAddresses.length;
  }

  isUserStriped(): boolean {
    return !!this.billing.payment.stripePaymentMethod;
  }

  isPaymentMethodIntegrated(): boolean {
    return this.billing.payment.isPaymentMethodIntegrated;
  }

  isNotificationEnabled(): boolean {
    return this.settings.notificationEnabled;
  }

  isLoginViaEmail(): boolean {
    return this.info.authProviders.includes('email');
  }
}
