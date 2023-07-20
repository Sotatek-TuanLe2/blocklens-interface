import { Flex, Text } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import useRecaptcha from 'src/hooks/useRecaptcha';
import { TYPE_MODAL } from 'src/pages/WorkspacePage/parts/Dashboard';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import { TYPE_OF_MODAL } from 'src/utils/common';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from '../BaseModal';
import { generateSubmitBtn, generateTitleModal } from './ModalQuery';

interface IModelNewDashboard {
  open: boolean;
  onClose: () => void;
  onSuccess?: (params: any) => void;
  id?: string;
  defaultValue?: { name: string; tags?: string[] };
  type: TYPE_MODAL.ADD | TYPE_MODAL.EDIT | string;
}

interface IDataSettingForm {
  name: string;
  tags: string;
}

const ModalDashboard: React.FC<IModelNewDashboard> = ({
  open,
  id,
  type,
  onClose,
  onSuccess,
  defaultValue = { name: '', tags: [''] },
}) => {
  const initDataFormSetting = {
    name: defaultValue.name || '',
    tags: defaultValue.tags?.join(', ') || '',
  };
  const { getAndSetRecaptcha } = useRecaptcha();

  const [dataForm, setDataForm] =
    useState<IDataSettingForm>(initDataFormSetting);

  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  useEffect(() => {
    if (!open) {
      setDataForm(initDataFormSetting);
      validator.current.visibleFields = [];
    }
  }, [open]);

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  const handleSubmitForm = async () => {
    try {
      await getAndSetRecaptcha();
      let result;
      setIsDisableSubmit(true);
      const submitData: { name: string; tags: string[] } = {
        name: dataForm.name.trim(),
        tags:
          !!dataForm.tags && !!dataForm.tags.length
            ? dataForm.tags
                .split(',')
                .filter((i) => i.trim().length)
                .map((i) => i.trim())
            : [],
      };

      switch (type) {
        case TYPE_OF_MODAL.CREATE:
          result = await rf
            .getRequest('DashboardsRequest')
            .createNewDashboard(submitData);
          toastSuccess({ message: 'Create new dashboard successfully!' });
          break;
        case TYPE_OF_MODAL.SETTING:
          result = await rf
            .getRequest('DashboardsRequest')
            .updateDashboardItem(submitData, id);
          toastSuccess({ message: 'Update dashboard successfully!' });
          break;
        case TYPE_OF_MODAL.FORK:
          result = await rf
            .getRequest('DashboardsRequest')
            .forkDashboard(submitData, id);
          toastSuccess({ message: 'Fork dashboard successfully!' });
          break;
      }
      onClose();
      onSuccess && (await onSuccess(result));
    } catch (error) {
      setIsDisableSubmit(false);
      toastError({ message: getErrorMessage(error) });
    }
  };

  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
      <Flex
        flexDirection={'column'}
        rowGap={'2rem'}
        className="main-modal-dashboard-details"
      >
        <div className="title-create-modal">
          {generateTitleModal(type)} Dashboard
        </div>
        <AppField label={'Dashboard Tittle'}>
          <AppInput
            value={dataForm.name}
            size="sm"
            placeholder="My dashboard"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDataForm({
                ...dataForm,
                name: e.target.value,
              })
            }
            validate={{
              name: `dashboard`,
              validator: validator.current,
              rule: ['required', 'max:150'],
            }}
          />
        </AppField>
        <AppField label={'Tags (optional)'}>
          <AppInput
            value={dataForm.tags}
            size="sm"
            placeholder="tag1, tag2, tag3"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDataForm({
                ...dataForm,
                tags: e.target.value,
              })
            }
            validate={{
              name: `tags`,
              validator: validator.current,
              rule: ['maxTags'],
            }}
          />
        </AppField>

        <Flex className="modal-footer">
          <AppButton
            mr={2.5}
            onClick={() => {
              onClose();
            }}
            size="lg"
            variant={'cancel'}
            className="btn-cancel"
          >
            Cancel
          </AppButton>
          <AppButton
            size="lg"
            onClick={handleSubmitForm}
            disabled={!dataForm.name.trim() || isDisableSubmit}
          >
            {generateSubmitBtn(type)}
          </AppButton>
        </Flex>
      </Flex>
    </BaseModal>
  );
};

export default ModalDashboard;
