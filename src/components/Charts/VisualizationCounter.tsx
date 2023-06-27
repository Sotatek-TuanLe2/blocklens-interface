import { Box, Flex, Skeleton, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import 'src/styles/components/CounterConfigurations.scss';
import { VISUALIZATION_COLORS } from 'src/utils/common';
import { VisualizationType } from 'src/utils/query.type';
import { roundAndPadZeros } from 'src/utils/utils-format';
import { isNumber } from 'src/utils/utils-helper';
const commaNumber = require('comma-number');

type Props = {
  data: unknown[];
  visualization: VisualizationType;
  isLoading?: boolean;
};

const NUMBER_SIZE = {
  start: 35,
  percent: 3,
};

const VisualizationCounter = ({ data, visualization, isLoading }: Props) => {
  const [size, setSize] = useState<number>();
  const { options: dataOptions } = visualization;

  useEffect(() => {
    setSize(defaultSize);
  }, [
    dataOptions.counterColName,
    dataOptions.stringPrefix,
    dataOptions.stringDecimal,
    dataOptions.rowNumber,
  ]);

  const dataCounter = () => {
    if (data[dataOptions.rowNumber - 1] === undefined) return '';
    const dataColumn: any = data[dataOptions.rowNumber - 1];
    const indexColumn = dataOptions.counterColName;

    return isNumber(dataColumn[indexColumn])
      ? commaNumber(dataColumn[indexColumn]?.toString())
      : dataColumn[indexColumn]?.toString();
  };

  const defaultSize =
    NUMBER_SIZE.start -
    ((dataCounter()?.length || 0) +
      Number(dataOptions.stringDecimal || 0) +
      (dataOptions.stringPrefix?.toString().length || 0) +
      (dataOptions.stringSuffix?.toString().length || 0)) /
      NUMBER_SIZE.percent;

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

  return (
    <Box bg={'url(/images/copyright-logo.png) no-repeat center 40%'} className="main-counter">
      <div className="counter-result">
        <div className="text-result">
          <div
            style={{
              color: (isNumberValue && checkColor(dataCounter())) || '',
              fontSize: `${size}px`,
              fontWeight: 700,
            }}
          >
            {isNumberValue && dataOptions.stringPrefix}
            <span>
              {isNumberValue
                ? roundAndPadZeros(
                    dataCounter(),
                    Number(dataOptions.stringDecimal || 0),
                  )
                : dataCounter()}
            </span>
            {isNumberValue && dataOptions.stringSuffix}
          </div>
          <Box isTruncated maxWidth={'300px'}>
            <Tooltip
              hasArrow
              placement="top-start"
              label={
                dataOptions.counterLabel ? dataOptions.counterLabel : 'Counter'
              }
            >
              {dataOptions.counterLabel ? dataOptions.counterLabel : 'Counter'}
            </Tooltip>
          </Box>
        </div>
      </div>
    </Box>
  );
};

export default VisualizationCounter;
