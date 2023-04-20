import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppButton, AppInput } from 'src/components';
import BaseModal from './BaseModal';

export interface IModalSaveQuery {
  open: boolean;
  onClose: () => void;
  onSubmit: any;
}

const ModalSaveQuery = ({ open, onClose, onSubmit }: IModalSaveQuery) => {
  const [nameQuerry, setNameQuerry] = useState('');

  const handleChangeNameQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNameQuerry(event.target.value);
  };
  return (
    <BaseModal
      size="xl"
      isOpen={open}
      onClose={onClose}
      onActionLeft={onClose}
      textActionLeft="Cancel"
      onActionRight={() => onSubmit(nameQuerry)}
      textActionRight="Save"
      isHideCloseIcon={true}
      className="modal-save-query"
    >
      <Box pt={'30px'}>
        <Box pb={'10px'}>Give your new query a name!</Box>
        <AppInput
          onChange={handleChangeNameQuery}
          value={nameQuerry}
          placeholder="Query name ..."
        />
        <Box pt={'20px'}>Don't worry, you can change this any time.</Box>
      </Box>
    </BaseModal>
  );
};

export default ModalSaveQuery;
