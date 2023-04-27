import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import 'src/styles/components/CounterConfigurations.scss';
import { VisualizationType } from 'src/utils/query.type';
import { roundAndPadZeros } from 'src/utils/utils-format';

type Props = {
  data: unknown[];
  visualization: VisualizationType;
};

const VisualizationCounter = ({ data, visualization }: Props) => {
  const [size, setSize] = useState<number>();
  const NUMBER_SIZE = {
    start: 35,
    percent: 3,
  };
  const dataOptions = visualization?.options;
  const dataCounter = () => {
    if (data[dataOptions.rowNumber - 1] === undefined) return '';
    const dataColumn: any = data[dataOptions.rowNumber - 1];
    const indexColumn = dataOptions.counterColName;
    return dataColumn[indexColumn];
  };
  const checkTypeValue = typeof dataCounter();
  const defaultSize =
    NUMBER_SIZE.start -
    (dataCounter().length +
      Number(dataOptions?.stringDecimal || 0) +
      (dataOptions?.stringPrefix?.toString().length || 0) +
      (dataOptions?.stringSuffix?.toString().length || 0)) /
      NUMBER_SIZE.percent;
  useEffect(() => {
    setSize(defaultSize);
  }, [
    dataOptions.counterColName,
    dataOptions.stringPrefix,
    dataOptions.stringDecimal,
    dataOptions.rowNumber,
  ]);

  const isNumber = checkTypeValue === 'number';
  const isBigNumber = !new BigNumber(dataCounter()).isNaN();
  const checkColor = (value: string | number) => {
    switch (true) {
      case new BigNumber(value).isGreaterThan(0) &&
        dataOptions.coloredPositiveValues:
        return '#006400';
      case new BigNumber(value).isLessThan(0) &&
        dataOptions.coloredNegativeValues:
        return '#d93025';
      default:
        return undefined;
    }
  };
  return (
    <div className="main-counter">
      <div className="counter-result">
        <div className="background-counter"></div>
        <div className="text-result">
          <div
            style={{
              color: (isBigNumber && checkColor(dataCounter())) || '',
              fontSize: ` ${size}px`,
            }}
          >
            {isNumber && dataOptions.stringPrefix}
            <span>
              {isNumber
                ? roundAndPadZeros(
                    dataCounter(),
                    Number(dataOptions.stringDecimal || 0),
                  )
                : dataCounter()}
            </span>
            {isNumber && dataOptions.stringSuffix}
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
