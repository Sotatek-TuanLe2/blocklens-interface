import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
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

  const onDelete = async () => {
    try {
      await rf
        .getRequest('RegistrationRequest')
        .deleteRegistration(webhook.appId, webhook.registrationId);
      dispatch(getUserStats());
      toastSuccess({ message: 'Delete Successfully!' });
      history.push(`/apps/${webhook.appId}`);
      onClose();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
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
        <AppButton width={'49%'} size={'lg'} onClick={onDelete}>
          Delete
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalDeleteWebhook;
