import { Box, Flex } from '@chakra-ui/react';
import _ from 'lodash';
import React, { useState } from 'react';
import { AppButton, AppInput } from 'src/components';
import BaseModal from './BaseModal';

export interface IModalSaveQuery {
  open: boolean;
  onClose: () => void;
  onSubmit: any;
}

const ModalSaveQuery = ({ open, onClose, onSubmit }: IModalSaveQuery) => {
  const [queryName, setQueryName] = useState('');

  const handleChangeNameQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQueryName(event.target.value);
  };
  return (
    <BaseModal
      size="xl"
      isOpen={open}
      onClose={() => {
        setQueryName('');
        onClose();
      }}
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
            disabled={!queryName.trim()}
            onClick={() => onSubmit(queryName)}
            size="sm"
          >
            Save
          </AppButton>
          <AppButton
            onClick={() => {
              setQueryName('');
              onClose();
            }}
            size="sm"
            variant={'cancel'}
          >
            Cancel
          </AppButton>
        </Flex>
      </Box>
    </BaseModal>
  );
};

export default ModalSaveQuery;
