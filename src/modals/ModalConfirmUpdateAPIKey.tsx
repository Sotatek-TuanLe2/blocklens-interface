import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import AppButton from 'src/components/AppButton';
import rf from 'src/requests/RequestFactory';
import { toastSuccess } from 'src/utils/utils-notify';
import BaseModal from './BaseModal';

interface IModalConfirmUpdateAPIKey {
  open: boolean;
  onClose: () => void;
  onReloadData: () => void;
}

const ModalConfirmUpdateAPIKey: FC<IModalConfirmUpdateAPIKey> = ({
  open,
  onClose,
  onReloadData,
}) => {
  const onConfirm = async () => {
    try {
      await rf.getRequest('AuthServiceRequest').updateAPIKey();
      onClose();
      toastSuccess({ message: 'Regenerate successfully!' });
      onReloadData();
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <BaseModal
      size="xl"
      title="Regenerate API Key"
      isOpen={open}
      description="Warning: Current API key will no longer be usable and a new key will be generated"
      onClose={onClose}
    >
      <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={4}>
        <AppButton
          width={'49%'}
          size={'lg'}
          variant={'cancel'}
          onClick={onClose}
        >
          Cancel
        </AppButton>
        <AppButton width={'49%'} size={'lg'} onClick={onConfirm}>
          Confirm
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalConfirmUpdateAPIKey;
