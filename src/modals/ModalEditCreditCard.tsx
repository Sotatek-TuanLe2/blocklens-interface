import React, { FC } from 'react';
import BaseModal from './BaseModal';
import FormCard from 'src/pages/BillingPage/parts/FormCard';
import useUser from '../hooks/useUser';

interface IModalEditCreditCard {
  open: boolean;
  onClose: () => void;
}

const ModalEditCreditCard: FC<IModalEditCreditCard> = ({ open, onClose }) => {
  const { user } = useUser();
  return (
    <BaseModal
      size="xl"
      title={!user?.getStripePayment() ? 'Add Credit Card' : 'Edit Credit Card'}
      description={
        !user?.getStripePayment()
          ? 'You need add your credit card for payment.'
          : ''
      }
      isOpen={open}
      onClose={onClose}
    >
      <FormCard isEdit onClose={onClose} />
    </BaseModal>
  );
};

export default ModalEditCreditCard;
