import React, { FC, useState } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard } from 'src/components';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { EditIcon } from 'src/assets/icons';
import ModalChangePassword from 'src/modals/ModalChangePassword';
import ModalEditInfo from 'src/modals/ModalEditInfo';
import ModalEditCreditCard from 'src/modals/ModalEditCreditCard';

const BasicDetail = () => {
  const [isOpenChangePasswordModal, setIsChangePasswordModal] =
    useState<boolean>(false);
  const [isOpenEditInfoModal, setIsOpenEditInfoModal] =
    useState<boolean>(false);
  const [isOpenEditCardModal, setIsOpenEditCardModal] =
    useState<boolean>(false);

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { billingInfos } = useSelector((state: RootState) => state.billing);

  return (
    <AppCard className="box-info-account">
      <Box className="info-item">
        <Box className="title">Basic Details</Box>
        <Flex>
          <Box className="label">Email:</Box>
          <Box className="value">{userInfo.email}</Box>
        </Flex>
        <Flex justifyContent={'space-between'} my={3}>
          <Flex>
            <Box className="label">Name:</Box>
            <Box className="value">
              {userInfo.firstName + ' ' + userInfo.lastName}
            </Box>
          </Flex>
          <Box
            className="btn-edit"
            onClick={() => setIsOpenEditInfoModal(true)}
          >
            <EditIcon />
          </Box>
        </Flex>
        <Flex justifyContent={'space-between'} my={3}>
          <Flex>
            <Box className="label">Card:</Box>
            <Box className="value">
              •••• •••• •••• {billingInfos?.paymentMethod?.card?.last4}
            </Box>
          </Flex>
          <Box
            className="btn-edit"
            onClick={() => setIsOpenEditCardModal(true)}
          >
            <EditIcon />
          </Box>
        </Flex>
        <Flex justifyContent={'space-between'}>
          <Flex>
            <Box className="label">Balance:</Box>
            <Box className="value">--</Box>
          </Flex>
          <Box className="link">Top up</Box>
        </Flex>
      </Box>

      <Box className="info-item">
        <Box className="title">Security</Box>
        <Flex justifyContent={'space-between'}>
          <Flex>
            <Box className="label">Password:</Box>
            <Box className="value">********</Box>
          </Flex>
          <Box
            className="btn-edit"
            onClick={() => setIsChangePasswordModal(true)}
          >
            <EditIcon />
          </Box>
        </Flex>
      </Box>

      {isOpenChangePasswordModal && (
        <ModalChangePassword
          open={isOpenChangePasswordModal}
          onClose={() => setIsChangePasswordModal(false)}
        />
      )}

      {isOpenEditInfoModal && (
        <ModalEditInfo
          open={isOpenEditInfoModal}
          onClose={() => setIsOpenEditInfoModal(false)}
        />
      )}

      {isOpenEditCardModal && (
        <ModalEditCreditCard
          open={isOpenEditCardModal}
          onClose={() => setIsOpenEditCardModal(false)}
        />
      )}
    </AppCard>
  );
};

export default BasicDetail;
