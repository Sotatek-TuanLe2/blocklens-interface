import { Flex } from '@chakra-ui/react';
import React from 'react';
import { AppButton } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import BaseModal from './BaseModal';
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
      if (res) {
        onReload();
        onClose();
      }
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
    >
      <form className="main-modal-dashboard-details">
        <Flex flexWrap={'wrap'} gap={'10px'} className="group-action-query">
          <AppButton
            size="sm"
            className="btn-remove"
            variant={'cancel'}
            onClick={(e) => handleRemoveItem(e)}
          >
            Remove this widget
          </AppButton>
          <AppButton
            size="sm"
            className="btn-remove"
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
