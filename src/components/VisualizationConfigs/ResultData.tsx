import { useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';
import AppSelect2 from '../AppSelect2';

interface IResultData {
  xAxis: string;
  yAxis: string[];
  axisOptions: string[];
  onChangeAxis: (xAxis: string, yAxis: string[]) => void;
}

const ResultData: React.FC<IResultData> = ({
  axisOptions,
  xAxis,
  yAxis,
  onChangeAxis,
}) => {
  const axisOptionsConfigs = useMemo(
    () => ['', ...axisOptions]?.map((axis) => ({ value: axis, label: axis })),
    [axisOptions],
  );

  const changeXAxisHandle = (value: string) => {
    let newYAxis = [...yAxis];
    if (yAxis.some((axis) => axis === value)) {
      newYAxis = yAxis.filter((axis) => axis !== value);
    }
    onChangeAxis(value, newYAxis);
  };

  const changeYAxisHandle = (value: string, oldValue: string) => {
    let newXAxis = xAxis;
    let newYAxis = [...yAxis];
    if (yAxis.some((axis) => axis === value)) {
      // duplicated value
      const index = newYAxis.indexOf(oldValue);
      const removedIndex = newYAxis.indexOf(value);
      newYAxis[index] = value;
      newYAxis.splice(removedIndex, 1);
    } else if (!value) {
      // empty value
      newYAxis = newYAxis.filter((axis) => axis !== oldValue);
    } else {
      const index = newYAxis.indexOf(oldValue);
      if (index >= 0) {
        newYAxis[index] = value;
      } else {
        newYAxis.push(value);
      }
    }
    if (value === xAxis) {
      newXAxis = '';
    }
    onChangeAxis(newXAxis, newYAxis);
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
        <Text w={'max-content'} mr={2} className="label-input">
          X column
        </Text>
        <AppSelect2
          className={'select-table'}
          zIndex={1001}
          options={axisOptionsConfigs}
          value={xAxis?.toString() || ''}
          onChange={changeXAxisHandle}
          size="medium"
        />
      </div>
      {(yAxis ? [...yAxis, ''] : ['']).map((axis, index) => {
        return (
          <div className={'box-table-children'} key={axis}>
            <Text w={'max-content'} mr={2} className="label-input">
              Y column {index + 1}
            </Text>
            <Box flex={1}>
              <AppSelect2
                size="medium"
                className={'select-table'}
                zIndex={1000 - index}
                width={'100%'}
                options={axisOptionsConfigs}
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
