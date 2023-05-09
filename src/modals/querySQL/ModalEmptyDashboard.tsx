import { Flex } from '@chakra-ui/react';
import React from 'react';
import { AppButton } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import BaseModal from '../BaseModal';

interface IModalEmptyDashboard {
  open: boolean;
  onAddText: () => void;
  onAddVisualization: () => void;
}

const ModalEmptyDashboard: React.FC<IModalEmptyDashboard> = ({
  open,
  onAddText,
  onAddVisualization,
}) => {
  return (
    <BaseModal
      isOpen={open}
      isHideCloseIcon
      closeOnOverlayClick={false}
      onClose={() => null}
      size="md"
    >
      <div className="main-modal-dashboard-details">
        <span>
          Please add at least one text widget or visualization widget to your
          dashboard!
        </span>
        <Flex className="modal-footer">
          <AppButton size="sm" onClick={onAddText}>
            Add text
          </AppButton>
          <AppButton onClick={onAddVisualization} size="sm">
            Add visualization
          </AppButton>
        </Flex>
      </div>
    </BaseModal>
  );
};

export default ModalEmptyDashboard;
