import { BasePageContainer } from 'src/layouts';
import { Box, Flex } from '@chakra-ui/react';
import BasicDetail from './parts/BasicDetail';
import BillingInfos from './parts/BillingInfos';
import 'src/styles/pages/AccountPage.scss';
import { isMobile } from 'react-device-detect';
import PaymentMethod from './parts/PaymentMethod';
import { AppCard } from 'src/components';
import Notifications from './parts/Notifications';
import AppConnectWalletButton from 'src/components/AppConnectWalletButton';
import useUser from 'src/hooks/useUser';
import { formatShortText } from 'src/utils/utils-helper';
import TopUpHistory from './parts/TopUpHistory';
import useWallet from 'src/hooks/useWallet';

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
              {isMobile
                ? formatShortText(user.getLinkedAddress())
                : user.getLinkedAddress()}
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
    <BasePageContainer className="account">
      <>
        <Box className="title-heading">Account</Box>
        <Flex
          flexWrap={'wrap'}
          justifyContent={'space-between'}
          flexDirection={isMobile ? 'column' : 'row'}
        >
          <Box className={'box-account'}>
            <BasicDetail />
          </Box>
          <Box className={'box-account'} mt={isMobile ? 5 : 0}>
            <BillingInfos />
          </Box>

          <Box className={'box-account'} mt={5}>
            <PaymentMethod />
          </Box>

          <Box className={'box-account'} mt={5}>
            <Notifications />
          </Box>
        </Flex>
        <Box mt={5}>
          <AppCard className="box-info-account accounts">
            <Flex justifyContent={'space-between'}>
              <Box className="info-item">
                <Box className="title">Linked Accounts</Box>
              </Box>
              {isMobile && user?.getLinkedAddress() && <Box className={'link'} onClick={unlinkWallet}>Unlink</Box>}
            </Flex>
            {_renderLinkedAccounts()}
          </AppCard>
        </Box>

        <Box mt={5}>
          <TopUpHistory />
        </Box>
      </>
    </BasePageContainer>
  );
};

export default AccountPage;
