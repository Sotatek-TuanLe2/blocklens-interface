import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { User, UserInterface } from 'src/utils/utils-user';

type ReturnType = {
  user: UserInterface | null;
};

const useUser = (): ReturnType => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const {
    userId,
    balance,
    email,
    billingEmail,
    firstName,
    lastName,
    isEmailVerified,
    walletAddress,
    stripePaymentMethod,
  } = userInfo;

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
    newUser.setLinkedAddress(walletAddress || '');
    newUser.setStripePayment(stripePaymentMethod);
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
  ]);

  return { user };
};

export default useUser;
