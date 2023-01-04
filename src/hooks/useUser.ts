import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { User, UserInterface } from 'src/utils/utils-user';

type ReturnType = {
  user: UserInterface | null;
};

const useUser = (): ReturnType => {
  const { userId, info, billing, settings } = useSelector((state: RootState) => state.user2);
  const {
    billingEmail,
    email,
    firstName,
    lastName,
    isEmailVerified
  } = info;
  const {
    payment: {
      balance,
      isPaymentMethodIntegrated,
      stripePaymentMethod,
      walletAddress,
      activePaymentMethod
    }
  } = billing;
  const { notificationEnabled } = settings;

  const user = useMemo(() => {
    if (!userId) {
      return null;
    }
    const newUser = new User(userId);
    newUser.setBalance(balance || '');
    newUser.setEmail(email || '');
    newUser.setBillingEmail(billingEmail || '');
    newUser.setFirstName(firstName || '');
    newUser.setLastName(lastName || '');
    newUser.setIsEmailVerified(!!isEmailVerified);
    newUser.setIsPaymentMethodIntegrated(!!isPaymentMethodIntegrated);
    newUser.setLinkedAddress(walletAddress || '');
    newUser.setStripePayment(stripePaymentMethod);
    newUser.setNotificationEnabled(!!notificationEnabled);
    newUser.setActivePaymentMethod(activePaymentMethod);
    return newUser;
  }, [
    userId,
    balance,
    email,
    billingEmail,
    firstName,
    lastName,
    isEmailVerified,
    walletAddress,
    stripePaymentMethod,
    isPaymentMethodIntegrated,
    notificationEnabled,
    activePaymentMethod
  ]);

  return { user };
};

export default useUser;
