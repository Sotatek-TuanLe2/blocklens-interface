import React, { useEffect, useState } from 'react';
import { BasePageContainer } from 'src/layouts';
import { Box, Flex } from '@chakra-ui/react';
import BasicDetail from './parts/BasicDetail';
import BillingInfos from './parts/BillingInfos';
import 'src/styles/pages/AccountPage.scss';
import { isMobile } from 'react-device-detect';
import PaymentMethod from './parts/PaymentMethod';
import { AppButton, AppCard } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';
import Notifications from './parts/Notifications';
import ModalConnectWallet from 'src/modals/ModalConnectWallet';

const AccountPage = () => {
  const [billingInfo, setBillingInfo] = useState<any>({});
  const [isOpenConnectWalletModal, setIsOpenConnectWalletModal] =
    useState<boolean>(false);

  const getBillingInfo = async () => {
    try {
      const res = await rf.getRequest('BillingRequest').getBillingInfo();
      setBillingInfo(res || {});
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };
  useEffect(() => {
    getBillingInfo().then();
  }, []);

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
            <BasicDetail billingInfo={billingInfo} />
          </Box>
          <Box className={'box-account'} mt={isMobile ? 5 : 0}>
            <BillingInfos />
          </Box>

          <Box className={'box-account'} mt={5}>
            <PaymentMethod billingInfo={billingInfo} />
          </Box>

          <Box className={'box-account'} mt={5}>
            <Notifications billingInfo={billingInfo} />
          </Box>
        </Flex>
        <Box mt={5}>
          <AppCard className="box-info-account accounts">
            <Flex justifyContent={'space-between'}>
              <Box className="info-item">
                <Box className="title">Linked Accounts</Box>
              </Box>
              {isMobile && <Box className={'link'}>Unlink</Box>}
            </Flex>

            <Flex justifyContent={'center'} my={isMobile ? 5 : 4}>
              <AppButton
                size="lg"
                onClick={() => setIsOpenConnectWalletModal(true)}
              >
                Connect wallet
              </AppButton>
            </Flex>

            {/*<Flex justifyContent={'space-between'} mb={5} className="info-item">*/}
            {/*  <Flex>*/}
            {/*    <Box className={'label'}>Addresses:</Box>*/}
            {/*    <Box className={'value'}>--</Box>*/}
            {/*  </Flex>*/}

            {/*  {!isMobile && <Box className={'link'}>Unlink</Box>}*/}
            {/*</Flex>*/}
          </AppCard>
        </Box>

        <ModalConnectWallet
          open={isOpenConnectWalletModal}
          onClose={() => setIsOpenConnectWalletModal(false)}
        />
      </>
    </BasePageContainer>
  );
};

export default AccountPage;
