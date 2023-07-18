import { Flex } from '@chakra-ui/react';
import { AppButton } from 'src/components';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import BaseModal from '../BaseModal';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';

export interface IModalDelete {
  open: boolean;
  onClose: () => void;
  id: string;
  type: string;
  onSuccess: () => void;
  selectedQueryId?: string;
}

const ModalDelete = ({
  open,
  onClose,
  type,
  onSuccess,
  selectedQueryId,
  id,
}: IModalDelete) => {
  const { dashboardId }: { queryId?: string; dashboardId?: string } =
    useParams();

  const getTitleModal = () => {
    if (type === LIST_ITEM_TYPE.QUERIES) return 'Query';
    if (type === LIST_ITEM_TYPE.DASHBOARDS) return 'Dashboard';
  };

  const handleRemove = async (id: string) => {
    const action = id === dashboardId ? 'removeDashboard' : 'removeQuery';
    const successMessage = {
      type: 'success',
      message:
        id === dashboardId
          ? 'Delete dashboard successfully!'
          : 'Delete query successfully!',
    };

    try {
      await rf.getRequest('DashboardsRequest')[action](selectedQueryId || id);
      toastSuccess(successMessage);
    } catch (error: any) {
      toastError(getErrorMessage(error));
    }
  };

  const handleSubmit = async () => {
    handleRemove(id);
    onSuccess();
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
