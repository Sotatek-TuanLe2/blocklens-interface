import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { AppButton, AppInput } from 'src/components';
import useUser from 'src/hooks/useUser';
import 'src/styles/components/BaseModal.scss';
import { copyToClipboard } from 'src/utils/utils-helper';
import BaseModal from './BaseModal';

interface IModalShareDashboardDetails {
  open: boolean;
  onClose: () => void;
}

const ModalShareDashboardDetails: React.FC<IModalShareDashboardDetails> = ({
  open,
  onClose,
}) => {
  const { user } = useUser();

  const link = `https://dune.com/${user?.getId()}/zzcs`;

  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
      <Flex flexDirection={'column'} rowGap={'2rem'} pt={'50px'}>
        <Text fontSize={'14px'}>
          Use the following link to share this public dashboard.
        </Text>
        <AppInput value={link} size="sm" placeholder="my-dashboard" />
      </Flex>
      <Flex flexWrap={'wrap'} gap={'10px'}>
        <AppButton
          size="sm"
          bg="#1e1870"
          color="#fff"
          onClick={() => copyToClipboard(link)}
        >
          Copy link
        </AppButton>
        <AppButton
          onClick={onClose}
          size="sm"
          bg="#ffeceb"
          color="#000"
          variant={'cancel'}
        >
          Cancel
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalShareDashboardDetails;
