import React, { FC, useState } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { AppCard } from 'src/components';
import { Box, Checkbox, Flex } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { EditIcon } from 'src/assets/icons';
import rf from 'src/requests/RequestFactory';
import { getInfoUser } from 'src/store/auth';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import ModalEditBillingEmail from 'src/modals/ModalEditBillingEmail';

const Notifications = () => {
  const [isOpenEditBillingEmailModal, setIsOpenEditBillingEmailModal] =
    useState<boolean>(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<any>();

  const updateNotificationFlag = async () => {
    try {
      await rf.getRequest('UserRequest').updateNotificationFlag({
        notificationEnabled: !userInfo.notificationEnabled,
      });
      dispatch(getInfoUser());
      toastSuccess({ message: 'Successfully' });
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  };

  return (
    <AppCard className="box-info-account notification">
      <Box className="info-item">
        <Flex justifyContent={'space-between'}>
          <Box className="title">notifications</Box>
        </Flex>

        <Flex>
          <Checkbox
            size="lg"
            isChecked={userInfo.notificationEnabled}
            mr={3}
            onChange={updateNotificationFlag}
          />
          <Box className="value">
            Receive emails when you are at or near your daily request limit.
          </Box>
        </Flex>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Box className="email">Receive Email: {userInfo?.billingEmail}</Box>
          {userInfo.notificationEnabled && (
            <Box
              className="btn-edit"
              onClick={() => setIsOpenEditBillingEmailModal(true)}
            >
              <EditIcon />
            </Box>
          )}
        </Flex>
      </Box>
      {isOpenEditBillingEmailModal && (
        <ModalEditBillingEmail
          open={isOpenEditBillingEmailModal}
          onClose={() => setIsOpenEditBillingEmailModal(false)}
        />
      )}
    </AppCard>
  );
};

export default Notifications;
