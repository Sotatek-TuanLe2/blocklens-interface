import { Flex } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { AppField, AppInput } from 'src/components';
import AppButton from 'src/components/AppButton';
import rf from 'src/requests/RequestFactory';
import { IAppResponse } from 'src/utils/utils-app';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { getUserStats } from '../store/user';
import { ROUTES } from '../utils/common';
import BaseModal from './BaseModal';

interface IModalEditApp {
  open: boolean;
  onClose: () => void;
  appInfo: IAppResponse;
}

const ModalDeleteApp: FC<IModalEditApp> = ({ open, onClose, appInfo }) => {
  const [nameApp, setNameApp] = useState<string>('');
  const [disabledDelete, setDisabledDelete] = useState<boolean>(true);
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    setDisabledDelete(nameApp !== appInfo.name);
  }, [nameApp, appInfo.name]);

  const onCloseModal = () => {
    onClose();
    setNameApp('');
  };

  const onDelete = async () => {
    try {
      setDisabledDelete(true);
      await rf.getRequest('AppRequest').deleteApp(appInfo.projectId);
      toastSuccess({ message: 'Delete Successfully!' });
      dispatch(getUserStats());
      history.push(ROUTES.TRIGGERS);
      onCloseModal();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
      setDisabledDelete(false);
    }
  };

  return (
    <BaseModal
      size="xl"
      icon="icon-delete"
      title="Delete Confirmation"
      isOpen={open}
      description="Any traffic going to deleted keys will stop working immediately.
       Please make sure that all processes using this project has been reconfigured before deleting."
      onClose={onCloseModal}
      isFullScreen={isMobile}
    >
      <AppField
        label={'Type Project Name below to confirm'}
        customWidth={'100%'}
        isRequired
      >
        <AppInput
          value={nameApp}
          onChange={(e) => setNameApp(e.target.value)}
        />
      </AppField>

      <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={4}>
        <AppButton
          width={'49%'}
          size={'lg'}
          variant={'cancel'}
          onClick={onCloseModal}
        >
          Cancel
        </AppButton>
        <AppButton
          width={'49%'}
          size={'lg'}
          isDisabled={disabledDelete}
          onClick={onDelete}
        >
          Delete Forever
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalDeleteApp;
