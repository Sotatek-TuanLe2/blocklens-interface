import { Flex } from '@chakra-ui/react';
import React from 'react';
import { AppButton } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import BaseModal from './BaseModal';

interface IModalEditItemDashBoard {
  open: boolean;
  onClose: () => void;
}

const ModalEditItemDashBoard: React.FC<IModalEditItemDashBoard> = ({
  open,
  onClose,
}) => {
  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      size="lg"
      className="modal-add-visualization"
    >
      <form className="main-modal-dashboard-details">
        <Flex flexWrap={'wrap'} gap={'10px'} className="group-action-query">
          <AppButton size="sm" bg="#e1e1f9" color="#1e1870" variant={'cancel'}>
            Remove this widget
          </AppButton>
          <AppButton
            size="sm"
            bg="#e1e1f9"
            color="#1e1870"
            variant={'cancel'}
            onClick={onClose}
          >
            Cancel
          </AppButton>
        </Flex>
      </form>
    </BaseModal>
  );
};

export default ModalEditItemDashBoard;
