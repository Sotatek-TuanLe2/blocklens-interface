import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import AppButton from 'src/components/AppButton';
import rf from 'src/requests/RequestFactory';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { getUserStats } from '../store/user';
import BaseModal from './BaseModal';

interface IModalChangeStatusApp {
  open: boolean;
  onClose: () => void;
  reloadData: () => void;
  appInfo: IAppResponse | null;
}

const ModalChangeStatusApp: FC<IModalChangeStatusApp> = ({
  open,
  onClose,
  appInfo,
  reloadData,
}) => {
  const dispatch = useDispatch();
  const onChangeStatus = async () => {
    try {
      await rf.getRequest('AppRequest').toggleApp(appInfo?.appId);
      dispatch(getUserStats());
      toastSuccess({ message: 'Update Successfully!' });
      onClose();
      reloadData();
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const getDescription = () => {
    if (appInfo?.status === APP_STATUS.DISABLED) {
      return (
        <div>
          This app will become Active. The webhooks in this app is <br />
          still Inactive, you will need to activate your selected <br />
          webhooks to start receiving Notify.
        </div>
      );
    }

    return (
      <div>
        This app and all webhooks in it will become Inactive.<br />
        You will stop receiving Notify for all webhooks<br />
        in this app. Continue?
      </div>
    );
  };

  return (
    <BaseModal
      size="lg"
      title={
        appInfo?.status === APP_STATUS.DISABLED
          ? 'Activate app'
          : 'Deactivate app'
      }
      isOpen={open}
      isFullScreen={isMobile}
      onClose={onClose}
    >
      <Box textAlign={'center'}>{getDescription()}</Box>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={10}>
        <AppButton
          width={'49%'}
          size={'lg'}
          variant={'cancel'}
          onClick={onClose}
        >
          Cancel
        </AppButton>
        <AppButton width={'49%'} size={'lg'} onClick={onChangeStatus}>
          Confirm
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalChangeStatusApp;
