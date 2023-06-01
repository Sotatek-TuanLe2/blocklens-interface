import { Flex, Text } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { AppButton, AppField, AppInput } from 'src/components';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import { MODAL, ROUTES } from 'src/utils/common';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from '../BaseModal';
import { IconUploadImg } from 'src/assets/icons';
import { TYPE_MODAL } from 'src/pages/WorkspacePage/parts/Dashboard';
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
  title: string;
  tag: string;
  thumbnail: File | null;
}

const ModalNewDashboard: React.FC<IModelNewDashboard> = ({
  open,
  id,
  type,
  onClose,
  onSuccess,
  defaultValue = { name: '', tags: [''] },
}) => {
  const initDataFormSetting = {
    title: defaultValue.name || '',
    tag: defaultValue.tags?.join(',') || '',
    thumbnail: null,
  };

  const history = useHistory();

  const [dataForm, setDataForm] =
    useState<IDataSettingForm>(initDataFormSetting);

  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [imageData, setImageData] = useState<string | null>(null);

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
      let result;
      switch (type) {
        case MODAL.CREATE:
          result = await rf.getRequest('DashboardsRequest').createNewDashboard({
            name: dataForm.title.trim(),
            tag: dataForm.tag.trim(),
          });
          break;
        case MODAL.SETTING:
          result = await rf.getRequest('DashboardsRequest').updateDashboardItem(
            {
              name: dataForm.title.trim(),
              tag: dataForm.tag.trim(),
            },
            id,
          );
          break;

        case MODAL.FORK:
          result = await rf.getRequest('DashboardsRequest').forkDashboard(
            {
              newDashboardName: dataForm.title.trim(),
              tag: dataForm.tag.trim(),
            },
            id,
          );
          break;
      }
      // type === TYPE_MODAL.ADD
      //   ? await rf.getRequest('DashboardsRequest').createNewDashboard({
      //       name: dataForm.title.trim(),
      //       tag: dataForm.tag.trim(),
      //     })
      //   : await rf.getRequest('DashboardsRequest').updateDashboardItem(
      //       {
      //         name: dataForm.title.trim(),
      //         tag: dataForm.tag.trim(),
      //       },
      //       id,
      //     );
      history.push(`${ROUTES.MY_DASHBOARD}/${result.id}`);
      onSuccess && (await onSuccess(result));
      toastSuccess({
        message: `${generateTitleModal(type)} successfully!`,
      });
      onClose();
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadImg = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    setDataForm({
      ...dataForm,
      thumbnail: file,
    });
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
            value={dataForm.title}
            size="sm"
            placeholder="My dashboard"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDataForm({
                ...dataForm,
                title: e.target.value,
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
            value={dataForm.tag}
            size="sm"
            placeholder=""
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDataForm({
                ...dataForm,
                tag: e.target.value,
              })
            }
            validate={{
              name: `tag`,
              validator: validator.current,
              rule: ['max:150'],
            }}
          />
        </AppField>
        <AppField label={'Thumbnail Image (optional)'}>
          <Flex
            flexDirection={'column'}
            alignItems={'center'}
            className="thumnail-create-modal"
            onClick={onUploadImg}
          >
            {imageData ? (
              <img src={imageData} alt="Preview" />
            ) : (
              <>
                <IconUploadImg />

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div className="desc">
                  Add a thumbnail image to show in the list
                </div>
              </>
            )}
          </Flex>
          <div className="note">
            You can check the thumbnail image in the PC version.
          </div>
        </AppField>
        <Flex className="modal-footer">
          <AppButton
            mr={2.5}
            onClick={() => {
              setImageData('');
              onClose();
            }}
            size="lg"
            variant={'cancel'}
          >
            Cancel
          </AppButton>
          <AppButton
            size="lg"
            onClick={handleSubmitForm}
            disabled={!dataForm.title.trim() || isDisableSubmit}
          >
            {generateSubmitBtn(type)}
          </AppButton>
        </Flex>
      </Flex>
    </BaseModal>
  );
};

export default ModalNewDashboard;
