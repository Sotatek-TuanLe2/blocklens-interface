import { Flex } from '@chakra-ui/react';
import { AppButton } from 'src/components';
import BaseModal from '../BaseModal';

export interface IModalDelete {
  open: boolean;
  onClose: () => void;
  onSubmit: any;
  type: string;
}

const ModalDelete = ({ open, onClose, onSubmit, type }: IModalDelete) => {
  const getTitleModal = () => {
    if (type === 'query') return 'Query';
    if (type === 'dashboard') return 'Dashboard';
  };

  const handleSubmit = async () => {
    onSubmit();
    onClose();
  };

  return (
    <BaseModal isOpen={open} onClose={onClose} className="modal-delete">
      <Flex direction={'column'}>
        <div className="modal-delete__img">
          <div className="bg-icon_bin" />
        </div>
        <div className="modal-delete__title">Delete {getTitleModal()}</div>
        <div className="modal-delete__content">
          Are you sure to delete this {getTitleModal()}? All contents within the
          {getTitleModal()} will be deleted
        </div>

        <Flex className="modal-footer">
          <AppButton py={'12px'} onClick={onClose} size="sm" variant={'cancel'}>
            Cancel
          </AppButton>
          <AppButton py={'12px'} size="sm" onClick={handleSubmit}>
            Delete
          </AppButton>
        </Flex>
      </Flex>
    </BaseModal>
  );
};

export default ModalDelete;
