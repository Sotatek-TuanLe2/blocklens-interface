import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { AppButton, AppInput } from 'src/components';
import BaseModal from '../BaseModal';
import { createValidator } from 'src/utils/utils-validator';

export interface IModalSaveQuery {
  open: boolean;
  onClose: () => void;
  onSubmit: any;
}

const ModalSaveQuery = ({ open, onClose, onSubmit }: IModalSaveQuery) => {
  const [queryName, setQueryName] = useState('');
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [queryName]);

  const handleChangeNameQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQueryName(event.target.value);
  };

  useEffect(() => {
    if (!open) {
      setQueryName('');
    }
  }, [open]);

  return (
    <BaseModal
      size="xl"
      isOpen={open}
      onClose={onClose}
      isHideCloseIcon={true}
      className="modal-save-query"
    >
      <Box pt={'30px'}>
        <Box pb={'10px'}>Give your new query a name!</Box>
        <AppInput
          onChange={handleChangeNameQuery}
          value={queryName}
          placeholder="Query name ..."
        />
        <Box pt={'20px'}>Don't worry, you can change this any time.</Box>
        <Flex className="modal-footer">
          <AppButton
            disabled={!queryName.trim() || isDisableSubmit}
            onClick={() => onSubmit(queryName)}
            size="sm"
          >
            Save
          </AppButton>
          <AppButton onClick={onClose} size="sm" variant={'cancel'}>
            Cancel
          </AppButton>
        </Flex>
      </Box>
    </BaseModal>
  );
};

export default ModalSaveQuery;
