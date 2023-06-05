import { BasePage } from 'src/layouts';
import { Box, Flex } from '@chakra-ui/react';
import BasicDetail from './parts/BasicDetail';
import BillingInfos from './parts/BillingInfos';
import 'src/styles/pages/AccountPage.scss';
import { isMobile } from 'react-device-detect';
import { AppCard, AppHeading } from 'src/components';
import Notifications from './parts/Notifications';
import AppConnectWalletButton from 'src/components/AppConnectWalletButton';
import useUser from 'src/hooks/useUser';
import { formatShortText, copyToClipboard } from 'src/utils/utils-helper';
import TopUpHistory from './parts/TopUpHistory';
import useWallet from 'src/hooks/useWallet';
import { CopyIcon } from 'src/assets/icons';
import React from 'react';
import UserAPIKey from './parts/UserAPIKey';

const AccountPage = () => {
  const { user } = useUser();
  const { unlinkWallet } = useWallet();

  const _renderLinkedAccounts = () => {
    if (user?.getLinkedAddress()) {
      return (
        <Flex justifyContent={'space-between'} mb={5} className="info-item">
          <Flex>
            <Box className={'label'}>Addresses:</Box>
            <Box className={'value'}>
              {formatShortText(user.getLinkedAddress())}
            </Box>
            <Box
              ml={2}
              className={'btn-copy'}
              onClick={() => copyToClipboard(user.getLinkedAddress())}
            >
              <CopyIcon />
            </Box>
          </Flex>
          {!isMobile && (
            <Box className={'link'} onClick={unlinkWallet}>
              Unlink
            </Box>
          )}
        </Flex>
      );
    }
    return (
      <Flex justifyContent={'center'} my={isMobile ? 5 : 4}>
        <AppConnectWalletButton>Connect Wallet</AppConnectWalletButton>
      </Flex>
    );
  };

  return (
    <BasePage className="account">
      <>
        <Box mb={7}>
          <AppHeading title="Account" />
        </Box>
        <Flex
          flexWrap={'wrap'}
          justifyContent={'space-between'}
          flexDirection={isMobile ? 'column' : 'row'}
        >
          <Box className={'box-account'}>
            <BasicDetail />
          </Box>
          {/*<Box className={'box-account'} mt={isMobile ? 5 : 0}>*/}
          {/*  <BillingInfos />*/}
          {/*</Box>*/}
          {/*<Box mt={5} className={'box-account'}>*/}
          {/*  <AppCard*/}
          {/*    className="box-info-account accounts"*/}
          {/*    justifyContent={'space-between'}*/}
          {/*  >*/}
          {/*    <Flex justifyContent={'space-between'}>*/}
          {/*      <Box className="info-item">*/}
          {/*        <Box className="title">Linked Accounts</Box>*/}
          {/*      </Box>*/}
          {/*      {isMobile && user?.getLinkedAddress() && (*/}
          {/*        <Box className={'link'} onClick={unlinkWallet}>*/}
          {/*          Unlink*/}
          {/*        </Box>*/}
          {/*      )}*/}
          {/*    </Flex>*/}
          {/*    {_renderLinkedAccounts()}*/}
          {/*  </AppCard>*/}
          {/*</Box>*/}

          <Box className={'box-account'}>
            <Notifications />
          </Box>
        </Flex>

        <Box mt={5}>
          <UserAPIKey />
        </Box>

        {/*<Box mt={5}>*/}
        {/*  <TopUpHistory />*/}
        {/*</Box>*/}
      </>
    </BasePage>
  );
};

export default AccountPage;
