import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import 'src/styles/components/CounterConfigurations.scss';
import { VISUALIZATION_COLORS } from 'src/utils/common';
import { VisualizationType } from 'src/utils/query.type';
import { roundAndPadZeros } from 'src/utils/utils-format';
import { isNumber } from 'src/utils/utils-helper';

type Props = {
  data: unknown[];
  visualization: VisualizationType;
};

const NUMBER_SIZE = {
  start: 35,
  percent: 3,
};

const VisualizationCounter = ({ data, visualization }: Props) => {
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
    return dataColumn[indexColumn];
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

  return (
    <div className="main-counter">
      <div className="counter-result">
        <div className="background-counter"></div>
        <div className="text-result">
          <div
            style={{
              color: (isNumberValue && checkColor(dataCounter())) || '',
              fontSize: `${size}px`,
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
          <div className="counter-sub-label">
            {dataOptions.counterLabel ? dataOptions.counterLabel : 'Counter'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationCounter;
