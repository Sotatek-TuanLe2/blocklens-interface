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
  type: string;
  typeData: string;
  time: string;
  onClose: () => void;
  onChangeTime: (value: string) => void;
  onChangeType: (value: string) => void;
  optionTypes: IOption[];
  optionTimes: IOption[];
}

const ModalFilterGraph: FC<IModalFilterGraph> = ({
  open,
  onClose,
  type,
  typeData,
  onChangeType,
  onChangeTime,
  time,
  optionTimes,
  optionTypes,
}) => {
  const _renderFilterType = () => {
    return (
      <Box>
        <Box className="label-filter"> Webhook Type</Box>
        <Box className="list-option">
          {optionTypes.map((item: IOption, index: number) => {
            return (
              <Box key={index}>
                <Checkbox
                  mb={4}
                  size="lg"
                  value={item.value}
                  isChecked={item.value === typeData}
                  onChange={(e) => {
                    e.preventDefault();
                    onChangeType(item.value);
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
      isFullScreen={isMobile}
      isBack={isMobile}
      isHideCloseIcon
      isOpen={open}
      onClose={onClose}
    >
      <Box mt={2}>
        {type === 'app' && <Box>{_renderFilterType()}</Box>}

        <Box>{_renderFilterTime()}</Box>
      </Box>
    </BaseModal>
  );
};

export default ModalFilterGraph;
