import { Box, Divider, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AppField, AppInput } from 'src/components';
import { IAppResponse } from 'src/utils/common';
import { copyToClipboard } from 'src/utils/utils-helper';
import BaseModal from './BaseModal';

interface IConnectBlocklensModal {
  isOpenAppModal: boolean;
  setIsOpenAppModal: any;
  dataConnectBlocklens: IAppResponse | null | undefined;
}

const ConnectBlocklensModal: React.FC<IConnectBlocklensModal> = ({
  isOpenAppModal,
  setIsOpenAppModal,
  dataConnectBlocklens,
}) => {
  return (
    <BaseModal
      size="2xl"
      title="Connect to Blocklens"
      isOpen={isOpenAppModal}
      onClose={() => {
        setIsOpenAppModal(false);
      }}
      onActionLeft={() => {
        console.log('Learn More');
      }}
      textActionLeft="LEARN MORE"
      className="modal-blocklens"
    >
      <Box flexDirection={'column'} pt={'20px'}>
        <AppField label={'API KEY'}>
          <AppInput
            isDisabled
            value={dataConnectBlocklens?.key || ''}
            endAdornment={
              <Box
                onClick={() => copyToClipboard(dataConnectBlocklens?.key || '')}
                className="field-info"
              >
                {' '}
                <div className="icon-copy_blue" />{' '}
                <Text className="button-copy">Copy</Text>
              </Box>
            }
          />
        </AppField>
        <AppField label={'HTTPS'}>
          <AppInput
            isDisabled
            endAdornment={
              <Box
                onClick={() => copyToClipboard('copy')}
                className="field-info"
              >
                {' '}
                <div className="icon-copy_blue" />{' '}
                <Text className="button-copy">Copy</Text>
              </Box>
            }
          />
        </AppField>
        <AppField label={'WEBSOKECTS'}>
          <AppInput
            isDisabled
            endAdornment={
              <Box
                onClick={() => copyToClipboard('copy')}
                className="field-info"
              >
                {' '}
                <div className="icon-copy_blue" />{' '}
                <Text className="button-copy">Copy</Text>
              </Box>
            }
          />
        </AppField>
        <Divider />
      </Box>
    </BaseModal>
  );
};

export default ConnectBlocklensModal;
