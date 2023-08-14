import React, { useState } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard } from 'src/components';
import { EditIcon } from 'src/assets/icons';
import ModalChangePassword from 'src/modals/ModalChangePassword';
import ModalEditInfo from 'src/modals/ModalEditInfo';
import ModalEditCreditCard from 'src/modals/ModalEditCreditCard';
import useUser from 'src/hooks/useUser';

const BasicDetail = () => {
  const [isOpenChangePasswordModal, setIsChangePasswordModal] =
    useState<boolean>(false);
  const [isOpenEditInfoModal, setIsOpenEditInfoModal] =
    useState<boolean>(false);
  const [isOpenEditCardModal, setIsOpenEditCardModal] =
    useState<boolean>(false);

  const { user } = useUser();

  return (
    <AppCard className="box-info-account">
      <Box className="info-item">
        <Box className="title">Basic Details</Box>
        <Flex>
          <Box className="label">Email:</Box>
          <Box className="value">{user?.getEmail()}</Box>
        </Flex>
        <Flex justifyContent={'space-between'} my={3}>
          <Flex>
            <Box className="label">Name:</Box>
            <Box className="value">
              {user?.getFirstName() + ' ' + user?.getLastName()}
            </Box>
          </Flex>
          <Box
            className="btn-edit"
            onClick={() => setIsOpenEditInfoModal(true)}
          >
            <EditIcon />
          </Box>
        </Flex>
        {/*<Flex justifyContent={'space-between'}>*/}
        {/*  <Flex>*/}
        {/*    <Box className="label">Balance:</Box>*/}
        {/*    <Box className="value">${user?.getBalance()}</Box>*/}
        {/*  </Flex>*/}
        {/*  <Box className="link" onClick={() => history.push('/top-up')}>*/}
        {/*    Top up*/}
        {/*  </Box>*/}
        {/*</Flex>*/}
      </Box>

      <Box className="info-item">
        <Box className="title">Security</Box>
        <Flex justifyContent={'space-between'}>
          <Flex>
            <Box className="label">Password:</Box>
            <Box className="value">********</Box>
          </Flex>
          {user?.isLoginViaEmail() && (
            <Box
              className="btn-edit"
              onClick={() => setIsChangePasswordModal(true)}
            >
              <EditIcon />
            </Box>
          )}
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
