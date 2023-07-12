import { Box, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import 'src/styles/components/CounterConfigurations.scss';
import { VISUALIZATION_COLORS } from 'src/utils/common';
import { VisualizationType } from 'src/utils/query.type';
import { isNumber } from 'src/utils/utils-helper';
const commaNumber = require('comma-number');

type Props = {
  data: unknown[];
  visualization: VisualizationType;
  isLoading?: boolean;
};

const VisualizationCounter = ({ data, visualization, isLoading }: Props) => {
  const { options: dataOptions } = visualization;

  if (isLoading) {
    return (
      <Flex
        align={'center'}
        justify={'center'}
        w={'full'}
        h={'full'}
        flexDir={'column'}
      >
        <Skeleton w={'80px'} h={'18px'} mb={'8px'} rounded={'9px'} />
        <Skeleton w={'180px'} h={'18px'} rounded={'9px'} />
      </Flex>
    );
  }

  const dataCounter = () => {
    if (data[dataOptions.rowNumber - 1] === undefined) return '';
    const dataColumn: any = data[dataOptions.rowNumber - 1];
    const indexColumn = dataOptions.counterColName;

    return dataColumn[indexColumn]?.toString();
  };

  const checkColor = (value: string | number) => {
    switch (true) {
      case new BigNumber(value).isGreaterThan(0) &&
        dataOptions.coloredPositiveValues:
        return VISUALIZATION_COLORS.POSITIVE;
      case new BigNumber(value).isLessThan(0) &&
        dataOptions.coloredNegativeValues:
        return VISUALIZATION_COLORS.NEGATIVE;
      default:
        return undefined;
    }
  };

  const isNumberValue = isNumber(dataCounter());
  const prefix = isNumberValue ? dataOptions.stringPrefix || '' : '';
  const value = isNumberValue
    ? commaNumber(
        new BigNumber(dataCounter()).toFixed(+dataOptions.stringDecimal || 0),
      )
    : dataCounter();
  const suffix = isNumberValue ? dataOptions.stringSuffix || '' : '';

  const counterValue = `${prefix}${value}${suffix}`;

  return (
    <Box
      _after={{
        bg: 'url(/images/copyright-logo.png) no-repeat center',
        bgSize: 'contain',
      }}
      className="main-counter"
    >
      <div className="main-counter__content">
        <Tooltip hasArrow placement="top" label={counterValue}>
          <Text
            className="main-counter__content__value"
            isTruncated
            style={{
              color: (isNumberValue && checkColor(dataCounter())) || '',
            }}
          >
            {counterValue}
          </Text>
        </Tooltip>
        <Tooltip
          hasArrow
          placement="top"
          label={
            dataOptions.counterLabel
              ? dataOptions.counterLabel
              : visualization.name
          }
        >
          <Text className="main-counter__content__label" isTruncated>
            {dataOptions.counterLabel
              ? dataOptions.counterLabel
              : visualization.name}
          </Text>
        </Tooltip>
      </div>
    </Box>
  );
};

export default VisualizationCounter;
