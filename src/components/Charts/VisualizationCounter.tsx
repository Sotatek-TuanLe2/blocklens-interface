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
    if (data[dataOptions.rowNumber - 1] === undefined) return;
    const dataColumn: any = data[dataOptions.rowNumber - 1];
    const indexColumn = dataOptions.counterColName;
    return dataColumn[indexColumn];
  };

  const checkTypeValue = typeof dataCounter();

  const defaultSize =
    NUMBER_SIZE.start -
    (dataCounter().toString().length +
      Number(dataOptions?.stringDecimal) +
      dataOptions?.stringPrefix?.toString().length +
      dataOptions?.stringSuffix?.toString().length) /
      NUMBER_SIZE.percent;

  useEffect(() => {
    setSize(defaultSize);
  }, [
    dataOptions.counterColName,
    dataOptions.stringPrefix,
    dataOptions.stringDecimal,
  ]);

  return (
    <div className="main-counter">
      <div className="counter-result">
        <div className="background-counter"></div>
        <div className="text-result">
          <div
            style={{
              color: dataOptions.coloredPositiveValues ? '#006400' : '',
              fontSize: `${size}px`,
            }}
          >
            {checkTypeValue === 'number' && dataOptions.stringPrefix}
            <span>
              {checkTypeValue === 'number'
                ? roundAndPadZeros(
                    dataCounter(),
                    Number(dataOptions.stringDecimal || 0),
                  )
                : dataCounter()}
            </span>
            {checkTypeValue === 'number' && dataOptions.stringSuffix}
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
