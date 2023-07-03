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
  typeData?: string;
  time: string;
  onClose: () => void;
  onChangeTime: (value: string) => void;
  optionTimes: IOption[];
}

const ModalFilterGraph: FC<IModalFilterGraph> = ({
  open,
  onClose,
  onChangeTime,
  time,
  optionTimes,
}) => {
  const _renderFilterTime = () => {
    return (
      <Box>
        <Box className="label-filter">Time</Box>
        <Box className="list-option">
          {optionTimes.map((item: IOption, index: number) => {
            return (
              <Box key={index}>
                <Checkbox
                  mb={4}
                  size="lg"
                  value={item.value}
                  isChecked={item.value === time}
                  onChange={(e) => {
                    e.preventDefault();
                    onChangeTime(item.value);
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
    );
  };

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
        <Box>{_renderFilterTime()}</Box>
      </Box>
    </BaseModal>
  );
};

export default ModalFilterGraph;
