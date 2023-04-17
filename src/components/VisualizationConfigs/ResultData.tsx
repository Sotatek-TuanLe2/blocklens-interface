import { useEffect, useMemo, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import AppSelect2 from '../AppSelect2';

interface IResultData {
  xAxisMapped: string;
  yAxesMapped: string[];
  axisOptions: string[];
  onChangeYAxis: (yAxis: string[]) => void;
  onChangeXAxis: (xAxis: string) => void;
}

const ResultData: React.FC<IResultData> = ({
  axisOptions,
  xAxisMapped,
  yAxesMapped,
  onChangeYAxis,
  onChangeXAxis,
}) => {
  const [configs, setConfigs] = useState({
    xAxis: xAxisMapped,
    yAxis: yAxesMapped,
  });

  const axisOptionsConfigs = useMemo(
    () => ['', ...axisOptions]?.map((axis) => ({ value: axis, label: axis })),
    [axisOptions],
  );

  useEffect(() => {
    setConfigs({
      xAxis: xAxisMapped,
      yAxis: yAxesMapped,
    });
  }, [xAxisMapped, yAxesMapped]);

  const changeYAxisHandle = (value: string, oldValue: string) => {
    if (value === '' && oldValue === '') {
      return;
    }
    if (oldValue === '') {
      const tempYAxes = [...configs.yAxis, value];
      return onChangeYAxis(tempYAxes);
    }
    if (value === '' && configs.yAxis?.length <= 1) {
      const tempYAxes = configs.yAxis.filter((item) => item !== oldValue);
      return onChangeYAxis(tempYAxes);
    }
    const index = configs.yAxis.indexOf(oldValue);
    const tempYAxes = configs.yAxis;
    tempYAxes[index] = value;
    onChangeYAxis(tempYAxes);
  };

  return (
    <div className={'box-table'}>
      <Text
        as={'h3'}
        className={'box-table__title'}
        fontWeight={'bold'}
        mb={'10px'}
      >
        Result data
      </Text>
      <div className={'box-table-children'}>
        <Text w={'max-content'} mr={2}>
          X column
        </Text>
        <AppSelect2
          className={'select-table'}
          zIndex={1001}
          options={axisOptionsConfigs?.filter((config) => {
            if (configs.yAxis?.length > 0) {
              return !configs.yAxis?.includes(config.value);
            }
            return true;
          })}
          value={configs.xAxis?.toString() || ''}
          onChange={onChangeXAxis}
        />
      </div>
      {(configs.yAxis ? [...configs.yAxis, ''] : ['']).map((axis, index) => {
        return (
          <div className={'box-table-children'} key={axis}>
            <Text w={'max-content'} mr={2}>
              Y column {index + 1}
            </Text>
            <Box flex={1}>
              <AppSelect2
                className={'select-table'}
                zIndex={1000 - index}
                width={'100%'}
                options={axisOptionsConfigs.filter((config) => {
                  return configs.yAxis
                    ? !configs.yAxis.includes(config.value) ||
                        axis !== configs.xAxis
                    : true;
                })}
                value={axis.toString()}
                onChange={(value) => {
                  changeYAxisHandle(value, axis);
                }}
              />
            </Box>
          </div>
        );
      })}
    </div>
  );
};

export default ResultData;
