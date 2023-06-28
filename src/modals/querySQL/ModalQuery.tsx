import { Box, Flex, Text } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useHistory } from 'react-router';
import { AppButton, AppInput } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { ROUTES, TYPE_OF_MODAL } from 'src/utils/common';
import { setRecaptchaToRequest } from 'src/utils/utils-auth';
import { toastSuccess } from 'src/utils/utils-notify';
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

export const generateTitleModal = (type: string) => {
  switch (type) {
    case TYPE_OF_MODAL.SETTING:
      return 'Setting';
    case TYPE_OF_MODAL.CREATE:
      return 'Create';
    case TYPE_OF_MODAL.FORK:
      return 'Fork';
    default:
      return '';
  }
};

export const generateSubmitBtn = (type: string) => {
  switch (type) {
    case TYPE_OF_MODAL.SETTING:
      return 'Update';
    case TYPE_OF_MODAL.CREATE:
      return 'Add';
    case TYPE_OF_MODAL.FORK:
      return 'Save';
    default:
      return '';
  }
};

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
  const { executeRecaptcha } = useGoogleReCaptcha();

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
      if (!executeRecaptcha) {
        console.error('Oops. Something went wrong!');
        return;
      }
      const result = await executeRecaptcha('homepage');
      setRecaptchaToRequest(result);
      let res;
      setIsDisableSubmit(true);
      try {
        switch (type) {
          case TYPE_OF_MODAL.SETTING:
            res = await rf
              .getRequest('DashboardsRequest')
              .updateQuery(valueSettingQuery, id);
            setIsDisableSubmit(false);
            toastSuccess({ message: 'Update query successfully!' });
            break;

          case TYPE_OF_MODAL.CREATE:
            res = await rf
              .getRequest('DashboardsRequest')
              .createNewQuery({ ...valueSettingQuery, query: query });
            setIsDisableSubmit(false);
            toastSuccess({ message: 'Create new query successfully!' });
            break;

          case TYPE_OF_MODAL.FORK:
            res = await rf
              .getRequest('DashboardsRequest')
              .forkQueries(id, { ...valueSettingQuery });
            setIsDisableSubmit(false);
            history.push(`${ROUTES.MY_QUERY}/${res.id}`);
            toastSuccess({ message: 'Fork query successfully!' });
            break;
        }
        onClose();
        onSuccess && (await onSuccess(res));
      } catch (error) {
        console.error(error);
      }
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
        <div className="modal-setting__title">
          {generateTitleModal(type)} Query
        </div>
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
              placeholder="tag1, tag2, tag3"
              value={valueSettingQuery.tags?.toString()}
              placeholder="tag1, tag2, tag3"
              onChange={handleChangeTags}
            />
          </div>
        </Box>
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
          <AppButton
            py={'12px'}
            size="sm"
            disabled={isDisableSubmit}
            onClick={handleSubmit}
          >
            {generateSubmitBtn(type)}
          </AppButton>
        </Flex>
      </Flex>
    </BaseModal>
  );
};

export default ModalQuery;
