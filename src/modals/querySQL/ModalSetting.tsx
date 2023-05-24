import { Box, Flex, Text } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AppButton, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from '../BaseModal';

export interface IModalSetting {
  open: boolean;
  onClose: () => void;
  onSubmit: any;
  type: string;
}

const ModalSetting = ({ open, onClose, onSubmit, type }: IModalSetting) => {
  const [valueSetting, setValueSetting] = useState({ title: '', tags: '' });
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [valueSetting]);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setValueSetting((pre) => ({ ...pre, title: e.target.value }));
  };
  const handleChangeTags = (e: ChangeEvent<HTMLInputElement>) => {
    setValueSetting((pre) => ({ ...pre, tags: e.target.value }));
  };

  const handleSubmit = async () => {
    onSubmit(valueSetting);
    onClose();
  };

  const getTitleModal = () => {
    if (type === 'query') return 'Query';
    if (type === 'dashboard') return 'Dashboard';
  };

  return (
    <BaseModal
      size="xl"
      isOpen={open}
      onClose={onClose}
      className="modal-setting"
    >
      <Flex direction={'column'}>
        <div className="modal-setting__title">Setting {getTitleModal()}</div>
        <Box className="modal-setting__content">
          <div>
            <Text className="input-label">{getTitleModal()} Title</Text>
            <AppInput
              value={valueSetting.title}
              validate={{
                name: `${getTitleModal()} title`,
                validator: validator.current,
                rule: ['required', 'max:150'],
              }}
              onChange={handleChangeTitle}
            />
          </div>
          <div>
            <Text className="input-label">{`Tags (optional)`} </Text>
            <AppInput value={valueSetting.tags} onChange={handleChangeTags} />
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

export default ModalSetting;
