import React, { useEffect, useState } from 'react';
import { BasePage } from 'src/layouts';
import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard, AppLink } from 'src/components';
import { EditIcon } from 'src/assets/icons';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';
import { isMobile } from 'react-device-detect';
import ModalBillingInfo from '../modals/ModalBillingInfo';
import { getErrorMessage } from '../utils/utils-helper';

const BillingInfoPage = () => {
  const [isOpenEditBillingInfoModal, setIsOpenEditBillingInfoModal] =
    useState<boolean>(false);

  const [billingInfo, setBillingInfo] = useState<any>({});
  const getBillingInfo = async () => {
    try {
      const res = await rf.getRequest('BillingRequest').getBillingInfo();
      setBillingInfo(res || {});
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };
  useEffect(() => {
    getBillingInfo().then();
  }, []);

  const _renderButtonEdit = () => {
    return (
      <Flex
        className="link"
        onClick={() => setIsOpenEditBillingInfoModal(true)}
      >
        <Box mr={3}> Edit </Box> <EditIcon />
      </Flex>
    );
  };

  return (
    <BasePage className="billing account">
      <>
        <Flex className="title-billing">
          <AppLink to={`/account`}>
            <Box className="icon-arrow-left" mr={6} />
          </AppLink>
          <Box>Billing Info</Box>
        </Flex>

        <AppCard className="box-info-account">
          <Flex justifyContent={'space-between'} width={'100%'}>
            <Flex flexDirection={isMobile ? 'column' : 'row'} width={'100%'}>
              <Flex
                justifyContent={'space-between'}
                width={isMobile ? '100%' : 'auto'}
              >
                <Box className="label">Billing Address:</Box>
                {isMobile && _renderButtonEdit()}
              </Flex>
              <Box className="value">
                <Box mb={1.5}>{billingInfo?.name}</Box>
                <Box mb={1.5}>{billingInfo?.address}</Box>
                <Box>{billingInfo?.country}</Box>
              </Box>
            </Flex>

            {!isMobile && _renderButtonEdit()}
          </Flex>

          <Flex mt={4} flexDirection={isMobile ? 'column' : 'row'}>
            <Box className="label">Billing Email:</Box>
            <Box className="value">{billingInfo?.email}</Box>
          </Flex>
        </AppCard>

        {isOpenEditBillingInfoModal && (
          <ModalBillingInfo
            open={isOpenEditBillingInfoModal}
            onClose={() => setIsOpenEditBillingInfoModal(false)}
            reloadData={getBillingInfo}
            billingInfo={billingInfo}
          />
        )}
      </>
    </BasePage>
  );
};

export default BillingInfoPage;
