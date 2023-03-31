import React from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import BaseModal from './BaseModal';
import 'src/styles/components/BaseModal.scss';
import { Flex, Text } from '@chakra-ui/react';

interface IModalForkDashBoardDetails {
  open: boolean;
  onClose: () => void;
}

const ModalForkDashBoardDetails: React.FC<IModalForkDashBoardDetails> = ({
  open,
  onClose,
}) => {
  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
      <div className="main-modal-dashboard-details">
        <AppField label={'Dashboard name'}>
          <AppInput size="sm" placeholder="My dashboard" />
          <Text fontSize="13px">https://dune.com/dinhtran/</Text>
        </AppField>
        <AppField label={'Customize the URL'}>
          <AppInput size="sm" placeholder="my-dashboard" />
        </AppField>
      </div>
      <Flex flexWrap={'wrap'} gap={'10px'} mt={10}>
        <AppButton size="sm" bg="#1e1870" color="#fff">
          Save and open
        </AppButton>
        <AppButton
          onClick={onClose}
          size="sm"
          bg="#e1e1f9"
          color="#1e1870"
          variant={'cancel'}
        >
          Cancel
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalForkDashBoardDetails;
