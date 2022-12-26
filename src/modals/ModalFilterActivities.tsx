import { Box, Checkbox } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { isMobile } from 'react-device-detect';

interface IOption {
  value: string;
  label: string;
}

interface IModalFilterGraph {
  open: boolean;
  value: string;
  onClose: () => void;
  onChange: (value: string) => void;
  options: IOption[];
}

const ModalFilterActivities: FC<IModalFilterGraph> = ({
  open,
  onClose,
  onChange,
  value,
  options,
}) => {
  return (
    <BaseModal
      size="xl"
      title="Filter"
      isBack={isMobile}
      isHideCloseIcon
      isOpen={open}
      className={'modal-filter'}
      onClose={onClose}
    >
      <Box mt={2}>
        <Box className="list-option">
          {options &&
            options.map((item: IOption, index: number) => {
              return (
                <Box key={index}>
                  <Checkbox
                    mb={4}
                    size="lg"
                    value={item.value}
                    isChecked={item.value === value}
                    onChange={(e) => {
                      e.preventDefault();
                      onChange(item.value);
                      onClose();
                    }}
                  >
                    {item.label}
                  </Checkbox>
                </Box>
              );
            })}
        </Box>
      </Box>
    </BaseModal>
  );
};

export default ModalFilterActivities;
