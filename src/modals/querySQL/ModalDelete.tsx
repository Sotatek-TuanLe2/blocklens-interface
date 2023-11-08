import { Flex } from '@chakra-ui/react';
import { AppButton } from 'src/components';
import { INSIGHTS_TABS } from 'src/pages/DashboardsPage';
import BaseModal from '../BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';

export interface IModalDelete {
  open: boolean;
  onClose: () => void;
  id: string;
  type: string;
  onSuccess: () => void;
}

const ModalDelete = ({ open, onClose, type, onSuccess, id }: IModalDelete) => {
  const isDashboard = type === INSIGHTS_TABS.DASHBOARDS;
  const isQuery = type === INSIGHTS_TABS.QUERIES;

  const getTitleModal = () => {
    if (isQuery) return 'Query';
    if (isDashboard) return 'Dashboard';
  };

  const getContentModal = () => {
    if (isDashboard) {
      return `Are you sure to delete this ${getTitleModal()?.toLocaleLowerCase()}? All contents within the ${getTitleModal()?.toLocaleLowerCase()} will be deleted`;
    }

    return `Tables and charts from this query will be removed from all dashboards. Are you sure?`;
  };

  const handleDelete = async () => {
    const action = isDashboard ? 'removeDashboard' : 'removeQuery';
    const successMessage = {
      type: 'success',
      message: isDashboard
        ? 'Delete dashboard successfully!'
        : 'Delete query successfully!',
    };

    try {
      await rf.getRequest('InsightsRequest')[action](id);
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
        <div className="modal-delete__content">{getContentModal()}</div>
        <Flex className="modal-footer" justifyContent="space-between">
          <AppButton
            py={'12px'}
            onClick={onClose}
            size="sm"
            variant={'cancel'}
            className="btn-cancel"
          >
            Cancel
          </AppButton>
          <AppButton py={'12px'} size="sm" onClick={handleDelete}>
            Delete
          </AppButton>
        </Flex>
      </Flex>
    </BaseModal>
  );
};

export default ModalDelete;
