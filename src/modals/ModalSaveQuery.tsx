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
  const [nameQuerry, setNameQuerry] = useState('');
  const [disableNameQueryBtn, setIsDisableNameQueryBtn] = useState(true);

  const handleChangeNameQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNameQuerry(event.target.value);
    !!_.trim(event.target.value)
      ? setIsDisableNameQueryBtn(false)
      : setIsDisableNameQueryBtn(true);
  };
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
          value={nameQuerry}
          placeholder="Query name ..."
        />
        <Box pt={'20px'}>Don't worry, you can change this any time.</Box>
        <Flex className="footer-modal">
          <AppButton variant="outline" onClick={() => onClose()}>
            Cancel
          </AppButton>
          <AppButton
            disabled={disableNameQueryBtn}
            onClick={() => onSubmit(nameQuerry)}
          >
            Save
          </AppButton>
        </Flex>
      </Box>
    </BaseModal>
  );
};

export default ModalSaveQuery;
