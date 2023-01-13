import { useState } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { AppCard } from 'src/components';
import { Box, Checkbox, Flex } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { EditIcon } from 'src/assets/icons';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import ModalEditReceiveEmail from 'src/modals/ModalEditReceiveEmail';
import { getUserProfile } from 'src/store/user';
import useUser from 'src/hooks/useUser';
import { getErrorMessage } from '../../../utils/utils-helper';

const Notifications = () => {
  const [isOpenEditReceiveEmailModal, setIsOpenEditReceiveEmailModal] =
    useState<boolean>(false);
  const dispatch = useDispatch<any>();
  const { user } = useUser();

  const updateNotificationFlag = async () => {
    try {
      await rf.getRequest('UserRequest').updateNotificationFlag({
        notificationEnabled: !user?.isNotificationEnabled(),
      });
      dispatch(getUserProfile());
      toastSuccess({ message: 'Successfully' });
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
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
            isChecked={user?.isNotificationEnabled()}
            mr={3}
            onChange={updateNotificationFlag}
          />
          <Box className="value">
            Receive emails when you are at or near your daily request limit.
          </Box>
        </Flex>
        <Flex
          alignItems={'self-start'}
          justifyContent={'space-between'}
          mt={2.5}
        >
          <Box className="email">Receive Email: {user?.getBillingEmail()}</Box>
          {user?.isNotificationEnabled() && (
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
