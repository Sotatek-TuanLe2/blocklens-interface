import { Flex } from '@chakra-ui/react';
import React from 'react';
import { AppButton } from 'src/components';
import { ILayout, WIDGET_TYPE } from 'src/pages/WorkspacePage/parts/Dashboard';
import 'src/styles/components/BaseModal.scss';
import { toastSuccess } from 'src/utils/utils-notify';
import BaseModal from '../BaseModal';

interface IModalEditItemDashBoard {
  open: boolean;
  selectedItem: ILayout;
  dataLayouts: ILayout[];
  onClose: () => void;
  onSave: (layouts: ILayout[]) => void;
}

const ModalDeleteWidget: React.FC<IModalEditItemDashBoard> = ({
  open,
  selectedItem,
  dataLayouts,
  onClose,
  onSave,
}) => {
  const handleRemoveItem = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const newDataLayouts = dataLayouts.filter(
      (item) => item.id !== selectedItem.id,
    );
    onSave(newDataLayouts);
    onClose();
    toastSuccess({ message: 'Remove successfully' });
  };

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      size="lg"
      className="modal-add-visualization"
      icon="icon-delete"
      title={`Remove ${
        selectedItem.type === WIDGET_TYPE.TEXT ? 'Widget' : 'Visualization'
      }`}
      description={`All contents within this ${
        selectedItem.type === WIDGET_TYPE.TEXT ? 'widget' : 'visualization'
      } will be removed.`}
    >
      <form className="main-modal-dashboard-details">
        <Flex flexWrap={'wrap'} gap={'10px'} className="group-action-query">
          <AppButton
            onClick={onClose}
            size="lg"
            variant={'cancel'}
            className="btn-cancel"
          >
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

export default ModalDeleteWidget;
