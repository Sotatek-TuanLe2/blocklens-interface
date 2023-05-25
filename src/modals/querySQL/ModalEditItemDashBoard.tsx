import { Flex } from '@chakra-ui/react';
import React from 'react';
import { AppButton } from 'src/components';
import { ILayout, WIDGET_TYPE } from 'src/pages/WorkspacePage/parts/Dashboard';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import BaseModal from '../BaseModal';

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
      if (selectedItem.type === WIDGET_TYPE.TEXT) {
        await rf
          .getRequest('DashboardsRequest')
          .removeTextWidget(selectedItem.id);
      } else {
        await rf
          .getRequest('DashboardsRequest')
          .removeVisualization(selectedItem.id);
      }
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
      description={'All contents within this widget will be removed.'}
    >
      <form className="main-modal-dashboard-details">
        <Flex flexWrap={'wrap'} gap={'10px'} className="group-action-query">
          <AppButton onClick={onClose} size="lg" variant={'cancel'}>
            Cancel
          </AppButton>
          <AppButton size="lg" onClick={(e) => handleRemoveItem(e)}>
            Remove
          </AppButton>
        </Flex>
      </form>
    </BaseModal>
  );
};

export default ModalEditItemDashBoard;
