import { Box, Flex } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { AppButton } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { IWebhook } from 'src/utils/utils-webhook';
import { getUserStats } from '../store/user';
import BaseModal from './BaseModal';
import { ROUTES } from '../utils/common';

interface IModalDeleteWebhook {
  open: boolean;
  onClose: () => void;
  webhook: IWebhook;
}

const ModalDeleteWebhook: FC<IModalDeleteWebhook> = ({
  open,
  onClose,
  webhook,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [disabledDelete, setDisabledDelete] = useState<boolean>(false);

  const onDelete = async () => {
    try {
      setDisabledDelete(true);
      await rf
        .getRequest('RegistrationRequest')
        .deleteRegistration(webhook.registrationId);
      dispatch(getUserStats());
      toastSuccess({ message: 'Delete Successfully!' });
      history.push(
        webhook.projectId
          ? `/app/${webhook.projectId}?type=${webhook.type}`
          : ROUTES.TRIGGERS,
      );
      onClose();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
      setDisabledDelete(false);
    }
  };

  return (
    <BaseModal
      size="xl"
      title="Delete This Webhook?"
      icon="icon-delete"
      isOpen={open}
      isFullScreen={isMobile}
      onClose={onClose}
    >
      <Box className={'infos'}>
        <Flex justifyContent={'space-between'} className="info">
          <Box>Webhook ID</Box>
          <Box>{webhook.registrationId}</Box>
        </Flex>
        <Flex justifyContent={'space-between'} className="info">
          <Box>URL</Box>
          <Box>{webhook.webhook}</Box>
        </Flex>
      </Box>

      <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={4}>
        <AppButton
          width={'49%'}
          size={'lg'}
          variant={'cancel'}
          onClick={onClose}
        >
          Cancel
        </AppButton>
        <AppButton
          width={'49%'}
          size={'lg'}
          disabled={disabledDelete}
          onClick={onDelete}
        >
          Delete
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalDeleteWebhook;
