import { Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppButton, AppInput } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import { copyToClipboard } from 'src/utils/utils-helper';
import { UserInterface } from 'src/utils/utils-user';
import BaseModal from './BaseModal';
import { SmallSuccessIcon } from 'src/assets/icons';

interface IModalShareDashboardDetails {
  open: boolean;
  onClose: () => void;
  user: UserInterface | null;
}

const ModalShareDashboardDetails: React.FC<IModalShareDashboardDetails> = ({
  open,
  onClose,
  user,
}) => {
  const [copy, setCopy] = useState<boolean>(false);
  const link = `https://dune.com/${user?.getId()}/zzcs`;

  const ButtonCopySuccess = () => {
    return (
      <Flex gap={'5px'} alignItems={'center'}>
        Link copied <SmallSuccessIcon />
      </Flex>
    );
  };

  const handleCloseModal = () => {
    onClose();
    setCopy(false);
  };

  return (
    <BaseModal isOpen={open} onClose={handleCloseModal} size="md">
      <Flex flexDirection={'column'} rowGap={'2rem'} pt={'50px'}>
        <Text fontSize={'14px'}>
          Use the following link to share this public dashboard.
        </Text>
        <AppInput value={link} size="sm" placeholder="my-dashboard" readOnly />
      </Flex>
      <Flex flexWrap={'wrap'} gap={'10px'}>
        <AppButton
          size="sm"
          bg="#1e1870"
          color="#fff"
          onClick={() => {
            copyToClipboard(link);
            setCopy(true);
          }}
        >
          {!copy ? 'Copy link' : <ButtonCopySuccess />}
        </AppButton>
        <AppButton
          onClick={handleCloseModal}
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
