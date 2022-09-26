import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import FormCreateAddress from 'src/pages/AppDetail/parts/FormCreateAddress';
import { IAppInfo } from 'src/pages/AppDetail';

interface ICreateAddressActivityModal {
  open: boolean;
  onClose: () => void;
  onReloadData: () => void;
  appInfo: IAppInfo;
}

const ModalCreateWebhookAddress: FC<ICreateAddressActivityModal> = ({
  open,
  onClose,
  appInfo,
  onReloadData,
}) => {
  return (
    <BaseModal
      size="2xl"
      title="Create Address Activity"
      isOpen={open}
      onClose={onClose}
      textActionLeft="Create Webhook"
    >
      <Box flexDirection={'column'} pt={'20px'}>
        <FormCreateAddress
          appInfo={appInfo}
          onClose={onClose}
          onReloadData={onReloadData}
        />
      </Box>
    </BaseModal>
  );
};

export default ModalCreateWebhookAddress;
