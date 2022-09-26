import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { IAppInfo } from 'src/pages/AppDetail';
import FormCreateContract from 'src/pages/AppDetail/parts/FormCreateContract';

interface ICreateNFTModal {
  open: boolean;
  onClose: () => void;
  appInfo: IAppInfo;
  onReloadData: () => void;
}

const ModalCreateWebhookContract: FC<ICreateNFTModal> = ({
  open,
  onClose,
  appInfo,
  onReloadData,
}) => {
  return (
    <BaseModal
      size="2xl"
      title="Create Contract"
      isOpen={open}
      onClose={onClose}
      textActionLeft="Create Webhook"
    >
      <Box flexDirection={'column'} pt={'20px'}>
        <FormCreateContract
          appInfo={appInfo}
          onClose={onClose}
          onReloadData={onReloadData}
        />
      </Box>
    </BaseModal>
  );
};

export default ModalCreateWebhookContract;
