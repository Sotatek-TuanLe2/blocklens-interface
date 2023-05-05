import { Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppButton, AppInput } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import { copyToClipboard } from 'src/utils/utils-helper';
import BaseModal from './BaseModal';
import { SmallSuccessIcon } from 'src/assets/icons';

interface IModalShareDashboardDetails {
  open: boolean;
  onClose: () => void;
}

const ModalShareDashboardDetails: React.FC<IModalShareDashboardDetails> = ({
  open,
  onClose,
}) => {
  const [copy, setCopy] = useState<boolean>(false);

  const link = window.location.toString();

  const handleCloseModal = () => {
    onClose();
    setCopy(false);
  };

  return (
    <BaseModal
      className="main-modal-share"
      isOpen={open}
      onClose={handleCloseModal}
      size="md"
    >
      <Flex flexDirection={'column'} rowGap={'2rem'} pt={'50px'}>
        <Text fontSize={'14px'}>
          Use the following link to share this public dashboard.
        </Text>
        <AppInput value={link} size="sm" placeholder="my-dashboard" readOnly />
      </Flex>
      <Flex className="modal-footer">
        <AppButton
          size="sm"
          onClick={() => {
            copyToClipboard(link);
            setCopy(true);
          }}
        >
          {!copy ? (
            'Copy link'
          ) : (
            <Flex gap={'5px'} alignItems={'center'}>
              Link copied <SmallSuccessIcon />
            </Flex>
          )}
        </AppButton>
        <AppButton onClick={handleCloseModal} size="sm" variant={'cancel'}>
          Cancel
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalShareDashboardDetails;
