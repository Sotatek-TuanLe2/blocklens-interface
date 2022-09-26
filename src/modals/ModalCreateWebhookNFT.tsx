import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import FormCreateNFT from 'src/pages/AppDetail/parts/FormCreateNFT';
import { IAppInfo } from 'src/pages/AppDetail';

interface ICreateNFTModal {
  open: boolean;
  onClose: () => void;
  appInfo: IAppInfo;
  onReloadData: () => void;
}

const ModalCreateWebhookNFT: FC<ICreateNFTModal> = ({
  open,
  onClose,
  appInfo,
  onReloadData,
}) => {
  return (
    <BaseModal
      size="2xl"
      title="Create NFT Activity"
      isOpen={open}
      onClose={onClose}
      textActionLeft="Create Webhook"
    >
      <Box flexDirection={'column'} pt={'20px'}>
        <FormCreateNFT
          appInfo={appInfo}
          onClose={onClose}
          onReloadData={onReloadData}
        />
      </Box>
    </BaseModal>
  );
};

export default ModalCreateWebhookNFT;
