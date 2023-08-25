import { Box, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { useMemo } from 'react';
import 'src/styles/components/CounterConfigurations.scss';
import { VISUALIZATION_COLORS } from 'src/utils/common';
import { VisualizationType } from 'src/utils/query.type';
import { isNumber } from 'src/utils/utils-helper';
import { Visualization } from 'src/utils/utils-query';
const commaNumber = require('comma-number');

type Props = {
  data: unknown[];
  visualization: VisualizationType;
  isLoading?: boolean;
};

const VisualizationCounter = ({ data, visualization, isLoading }: Props) => {
  const visualizationClass = useMemo(
    () => new Visualization(visualization),
    [visualization],
  );

  const dataOptions = visualizationClass.getConfigs();

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

  const getCounterValue = (): string => {
    if (data[dataOptions.rowNumber - 1] === undefined) return '';
    const dataColumn: any = data[dataOptions.rowNumber - 1];
    const indexColumn = dataOptions.counterColName;

    return dataColumn[indexColumn]?.toString() || '';
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

  const counterValue = getCounterValue();
  const isNumberValue = isNumber(counterValue);
  const prefix = isNumberValue ? dataOptions.stringPrefix || '' : '';
  const value = isNumberValue
    ? commaNumber(
        new BigNumber(counterValue).toFixed(+dataOptions.stringDecimal || 0),
      )
    : counterValue;
  const suffix = isNumberValue ? dataOptions.stringSuffix || '' : '';
  const counterValueText = `${prefix}${value}${suffix}`;

  return (
    <Box
      _after={{
        bg: 'url(/images/copyright-logo.png) no-repeat center',
        bgSize: 'contain',
      }}
      className="main-counter"
    >
      <div className="main-counter__content">
        <Tooltip hasArrow placement="top" label={counterValueText}>
          <Text
            className="main-counter__content__value"
            isTruncated
            style={{
              color: (isNumberValue && checkColor(counterValue)) || '',
            }}
          >
            {counterValueText}
          </Text>
        </Tooltip>
        <Tooltip
          hasArrow
          placement="top"
          label={
            dataOptions.counterLabel
              ? dataOptions.counterLabel
              : visualizationClass.getName()
          }
        >
          <Text className="main-counter__content__label" isTruncated>
            {dataOptions.counterLabel
              ? dataOptions.counterLabel
              : visualizationClass.getName()}
          </Text>
        </Tooltip>
      </div>
    </Box>
  );
};

export default VisualizationCounter;
