import 'src/styles/pages/AccountPage.scss';
import { Box } from '@chakra-ui/react';
import { AppCard, AppInput, AppLink } from 'src/components';
import useUser from 'src/hooks/useUser';
import { CopyIcon } from 'src/assets/icons';
import { copyToClipboard } from 'src/utils/utils-helper';
import { useCallback, useEffect, useState } from 'react';
import { IAppResponse } from '../../../utils/utils-app';
import rf from '../../../requests/RequestFactory';
import { isMobile } from 'react-device-detect';
import { shortenWalletAddress } from '../../../utils/utils-wallet';

const UserAPIKey = () => {
  const [apiKey, setApiKey] = useState<string>('');

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
            <Box
              cursor="pointer"
              className="btn-copy"
              onClick={() => copyToClipboard(apiKey)}
            >
              <CopyIcon />
            </Box>
          }
        />
      </Box>
    </AppCard>
  );
};

export default UserAPIKey;
