import { Box, Flex, Text } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AppButton, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from '../BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';

export interface IModalSettingQuerry {
  open: boolean;
  onClose: () => void;
  onSuccess?: (res: any) => void;
  defaultValue: { name: string; tags?: string[] };
  id: string;
}

const ModalSettingQuery = ({
  open,
  onClose,
  onSuccess,
  defaultValue = { name: '', tags: [''] },
  id,
}: IModalSettingQuerry) => {
  const [valueSettingQuery, setValueSettingQuery] = useState({
    ...defaultValue,
  });
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
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
      try {
        const res = await rf
          .getRequest('DashboardsRequest')
          .updateQuery(valueSettingQuery, id);
        onSuccess && (await onSuccess(res));
        onClose();
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
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
        <div className="modal-setting__title">Setting Query</div>
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
            Update
          </AppButton>
        </Flex>
      </Flex>
    </BaseModal>
  );
};

export default ModalSettingQuery;
