import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { AppButton } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import BaseModal from '../BaseModal';
import { ILayout } from 'src/pages/DashboardDetailPage';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import rf from 'src/requests/RequestFactory';

interface IModalEditItemDashBoard {
  open: boolean;
  onClose: () => void;
  selectedItem: ILayout;
  onReload: () => Promise<void>;
}

const ModalEditItemDashBoard: React.FC<IModalEditItemDashBoard> = ({
  open,
  onClose,
  selectedItem,
  onReload,
}) => {
  const handleRemoveItem = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    try {
      e.preventDefault();
      const res = await rf
        .getRequest('DashboardsRequest')
        .removeVisualization(selectedItem.id);
      onReload();
      onClose();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };
  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      size="lg"
      className="modal-add-visualization"
      icon="icon-delete"
      title={'Remove Widget'}
      description={
        'Are you sure to remove this widget? All contents within this widget will be deleted'
      }
    >
      <form className="main-modal-dashboard-details">
        <Flex flexWrap={'wrap'} gap={'10px'} className="group-action-query">
          <AppButton onClick={onClose} size="lg" variant={'cancel'}>
            Cancel
          </AppButton>
          <AppButton size="lg" onClick={(e) => handleRemoveItem(e)}>
            Delete
          </AppButton>
        </Flex>
      </form>
    </BaseModal>
  );
};

export default ModalEditItemDashBoard;
