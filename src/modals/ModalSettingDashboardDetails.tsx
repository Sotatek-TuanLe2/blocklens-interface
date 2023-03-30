import { Checkbox, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import BaseModal from './BaseModal';

interface IModalSettingDashboardDetails {
  open: boolean;
  onClose: () => void;
}

const ModalSettingDashboardDetails: React.FC<IModalSettingDashboardDetails> = ({
  open,
  onClose,
}) => {
  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
      <Flex
        flexDirection={'column'}
        rowGap={'2rem'}
        className="main-modal-dashboard-details"
      >
        <AppField label={'Dashboard title'}>
          <AppInput size="sm" placeholder="my-dashboard" />
        </AppField>
        <AppField label={'Customize the URL'}>
          <AppInput size="sm" placeholder="largom-demo" />
        </AppField>
        <AppField label={'Dashboard tags'}>
          <AppInput size="sm" placeholder="Tag 1, tag2, tag-3" />
          <Text fontSize="13px">https://dune.com/dinhtran/</Text>
        </AppField>
        <AppField label={'Privacy'}>
          <Checkbox size={'sm'}>Make private</Checkbox>
        </AppField>
      </Flex>
      <Flex
        flexWrap={'wrap'}
        gap={'10px'}
        justifyContent={'space-between'}
        pt={'15px'}
      >
        <AppButton size="sm" bg="#1e1870" color="#fff">
          Copy link
        </AppButton>
        <Flex gap={1}>
          <AppButton
            onClick={onClose}
            size="sm"
            color="#d93025"
            variant="setup"
          >
            Archive
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
      </Flex>
    </BaseModal>
  );
};

export default ModalSettingDashboardDetails;
