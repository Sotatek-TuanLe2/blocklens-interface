import { Flex } from '@chakra-ui/react';
import { AppButton } from 'src/components';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import BaseModal from '../BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';

export interface IModalDelete {
  open: boolean;
  onClose: () => void;
  id: string;
  type: string;
  onSuccess: () => void;
}

const ModalDelete = ({ open, onClose, type, onSuccess, id }: IModalDelete) => {
  const getTitleModal = () => {
    if (type === LIST_ITEM_TYPE.QUERIES) return 'Query';
    if (type === LIST_ITEM_TYPE.DASHBOARDS) return 'Dashboard';
  };

  const handleSubmit = async () => {
    const action =
      type === LIST_ITEM_TYPE.DASHBOARDS ? 'removeDashboard' : 'removeQuery';
    const successMessage = {
      type: 'success',
      message:
        type === LIST_ITEM_TYPE.DASHBOARDS
          ? 'Delete dashboard successfully!'
          : 'Delete query successfully!',
    };

    try {
      await rf.getRequest('DashboardsRequest')[action](id);
      onSuccess();
      onClose();
      toastSuccess(successMessage);
    } catch (error: any) {
      toastError({ message: error.message });
    }
  };

  return (
    <BaseModal isOpen={open} onClose={onClose} className="modal-delete">
      <Flex direction={'column'}>
        <div className="modal-delete__img">
          <div className="bg-icon_bin" />
        </div>
        <div className="modal-delete__title">Delete {getTitleModal()}</div>
        <div className="modal-delete__content">
          Are you sure to delete this {getTitleModal()?.toLocaleLowerCase()}?
          All contents within the {getTitleModal()?.toLocaleLowerCase()} will be
          deleted
        </div>

        <Flex className="modal-footer">
          <AppButton
            py={'12px'}
            onClick={onClose}
            size="sm"
            variant={'cancel'}
            className="btn-cancel"
          >
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
