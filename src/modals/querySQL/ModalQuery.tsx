import { Box, Flex, Text } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { AppButton, AppInput } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { QUERY_MODAL, ROUTES } from 'src/utils/common';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from '../BaseModal';

export interface IModalSettingQuerry {
  open: boolean;
  onClose: () => void;
  onSuccess?: (res: any) => void;
  defaultValue?: { name: string; tags?: string[] };
  id?: string;
  type: string;
  query?: string;
}

const ModalQuery = ({
  open,
  onClose,
  onSuccess,
  defaultValue = { name: '', tags: [''] },
  id,
  type,
  query,
}: IModalSettingQuerry) => {
  const [valueSettingQuery, setValueSettingQuery] = useState({
    ...defaultValue,
  });
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      const isDisabled = !validator.current.allValid();
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [valueSettingQuery]);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setValueSettingQuery((pre) => ({ ...pre, name: e.target.value }));
  };
  const handleChangeTags = (e: ChangeEvent<HTMLInputElement>) => {
    setValueSettingQuery((pre) => ({ ...pre, tags: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!isDisableSubmit) {
      let res;
      try {
        switch (type) {
          case QUERY_MODAL.SETTING:
            res = await rf
              .getRequest('DashboardsRequest')
              .updateQuery(valueSettingQuery, id);
            break;
          case QUERY_MODAL.CREATE:
            res = await rf
              .getRequest('DashboardsRequest')
              .createNewQuery({ ...valueSettingQuery, query: query });
            await rf.getRequest('DashboardsRequest').executeQuery(res.id);
            history.push(`${ROUTES.MY_QUERY}/${res.id}`);
            break;
          case QUERY_MODAL.FORK:
            res = await rf
              .getRequest('DashboardsRequest')
              .forkQueries(id, { ...valueSettingQuery });
            break;
        }
        onSuccess && (await onSuccess(res));
        onClose();
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    }
  };

  const generateTitleModal = () => {
    switch (type) {
      case QUERY_MODAL.SETTING:
        return 'Setting';
      case QUERY_MODAL.CREATE:
        return 'Create';
      case QUERY_MODAL.FORK:
        return 'Fork';
      default:
        return '';
    }
  };

  const generateSubmitBtn = () => {
    switch (type) {
      case QUERY_MODAL.SETTING:
        return 'Update';
      case QUERY_MODAL.CREATE:
        return 'Add';
      case QUERY_MODAL.FORK:
        return 'Save';
      default:
        return '';
    }
  };

  return (
    <BaseModal
      size="xl"
      isOpen={open}
      onClose={onClose}
      className="modal-setting"
    >
      <Flex direction={'column'}>
        <div className="modal-setting__title">{generateTitleModal()} Query</div>
        <Box className="modal-setting__content">
          <div>
            <Text className="input-label">Query Title</Text>
            <AppInput
              value={valueSettingQuery.name}
              validate={{
                name: `Query title`,
                validator: validator.current,
                rule: ['required', 'max:150'],
              }}
              onChange={handleChangeTitle}
            />
          </div>
          <div>
            <Text className="input-label">{`Tags (optional)`} </Text>
            <AppInput
              value={valueSettingQuery.tags?.toString()}
              onChange={handleChangeTags}
            />
          </div>
        </Box>
        <Flex className="modal-footer">
          <AppButton py={'12px'} onClick={onClose} size="sm" variant={'cancel'}>
            Cancel
          </AppButton>
          <AppButton
            py={'12px'}
            size="sm"
            disabled={isDisableSubmit}
            onClick={handleSubmit}
          >
            {generateSubmitBtn()}
          </AppButton>
        </Flex>
      </Flex>
    </BaseModal>
  );
};

export default ModalQuery;
