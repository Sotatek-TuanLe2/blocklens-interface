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
import ModalEditReceiveEmail from 'src/modals/ModalEditReceiveEmail';

const Notifications = () => {
  const [isOpenEditReceiveEmailModal, setIsOpenEditReceiveEmailModal] =
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
        <Flex alignItems={'self-start'} justifyContent={'space-between'} mt={2.5}>
          <Box className="email">Receive Email: {userInfo?.billingEmail}</Box>
          {userInfo.notificationEnabled && (
            <Box
              className="btn-edit"
              onClick={() => setIsOpenEditReceiveEmailModal(true)}
            >
              <EditIcon />
            </Box>
          )}
        </Flex>
      </Box>
      {isOpenEditReceiveEmailModal && (
        <ModalEditReceiveEmail
          open={isOpenEditReceiveEmailModal}
          onClose={() => setIsOpenEditReceiveEmailModal(false)}
        />
      )}
    </AppCard>
  );
};

export default Notifications;
