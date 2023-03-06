import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard, AppInput, AppLink } from 'src/components';
import { CopyIcon, RetryIcon } from 'src/assets/icons';
import { copyToClipboard } from 'src/utils/utils-helper';
import React, { useCallback, useEffect, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import { isMobile } from 'react-device-detect';
import { shortenWalletAddress } from 'src/utils/utils-wallet';
import ModalConfirmUpdateAPIKey from 'src/modals/ModalConfirmUpdateAPIKey';

const UserAPIKey = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [openModalConfirmUpdate, setOpenModalConfirmUpdate] =
    useState<boolean>(false);

  const getAPIKey = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('AuthServiceRequest')
        .getAPIKey()) as any;
      setApiKey(res.apiKey);
    } catch (error: any) {
      setApiKey('');
    }
  }, []);

  useEffect(() => {
    getAPIKey().then();
  }, []);

  return (
    <AppCard className="box-info-account user-api">
      <Box className="user-api__title">User API Key</Box>

      <Box>
        <Box className="user-api__label">
          You can query blockchain data via api by API keys now. See more in{' '}
          <AppLink to={'#'} className="link">
            Our docs.
          </AppLink>
        </Box>

        <AppInput
          className="user-api__input"
          isDisabled
          value={isMobile ? shortenWalletAddress(apiKey) : apiKey}
          endAdornment={
            <Flex className={'user-api__action'}>
              <Box
                cursor="pointer"
                className="btn-copy"
                onClick={() => setOpenModalConfirmUpdate(true)}
              >
                <RetryIcon />
              </Box>
              <Box
                cursor="pointer"
                className="btn-copy"
                onClick={() => copyToClipboard(apiKey)}
              >
                <CopyIcon />
              </Box>
            </Flex>
          }
        />
      </Box>

      {openModalConfirmUpdate && (
        <ModalConfirmUpdateAPIKey
          onReloadData={getAPIKey}
          open={openModalConfirmUpdate}
          onClose={() => setOpenModalConfirmUpdate(false)}
        />
      )}
    </AppCard>
  );
};

export default UserAPIKey;
