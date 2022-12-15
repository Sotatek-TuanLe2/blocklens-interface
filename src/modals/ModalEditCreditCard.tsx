import React, { FC } from 'react';
import BaseModal from './BaseModal';
import FormCard from 'src/pages/BillingPage/parts/FormCard';

interface IModalEditCreditCard {
  open: boolean;
  onClose: () => void;
}

const ModalEditCreditCard: FC<IModalEditCreditCard> = ({ open, onClose }) => {
  return (
    <BaseModal
      size="xl"
      title="Edit Credit Card"
      isOpen={open}
      onClose={onClose}
    >
      <FormCard isEdit onClose={onClose} />
    </BaseModal>
  );
};

export default ModalEditCreditCard;
