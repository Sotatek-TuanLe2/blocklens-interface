import React, { useMemo, useState } from 'react';
import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AppCard, AppInput, AppSelect2 } from '../index';
import {
  ChartOptionConfigsType,
  XAxisConfigsType,
} from '../../utils/visualization.type';

const ChartSettings = () => {
  const [chartOptions, setChartOptions] = useState<ChartOptionConfigsType>(
    {} as ChartOptionConfigsType,
  );
  const [xConfigs, setXConfigs] = useState<XAxisConfigsType>(
    {} as XAxisConfigsType,
  );
  const [columnMapping, setColumnMapping] = useState({
    xAxis: 'time',
    yAxis: ['size'] as string[],
  });

  return (
    <VStack spacing={'24px'}>
      <ChartOptions
        options={chartOptions}
        onChangeOptions={(options) => {
          console.log('options', options);
          setChartOptions(options);
        }}
      />
      <ResultDataConfigs
        axisOptions={['time', 'number', 'size', 'hash', 'hihi']}
        xAxisMapped={columnMapping.xAxis}
        yAxesMapped={columnMapping.yAxis}
        onChangeXAxis={(xAxis) => {
          setColumnMapping({ ...columnMapping, xAxis });
        }}
        onChangeYAxes={(yAxes) =>
          setColumnMapping({ ...columnMapping, yAxis: yAxes })
        }
      />
      <XAxisConfigs
        xConfigs={xConfigs}
        onChangeConfigs={(configs) => {
          console.log('configs', configs);
          setXConfigs(configs);
        }}
      />
      <YAxisConfigs />
    </VStack>
  );
};

const ChartOptions = ({
  options,
  onChangeOptions,
}: {
  options: ChartOptionConfigsType;
  onChangeOptions: (options: ChartOptionConfigsType) => void;
}) => {
  const chartOptionsConfigs = [
    { label: 'Show chart legend', value: 'showLegend' },
    { label: 'Enable stacking', value: 'stacking' },
    { label: 'Normalize to percentage', value: 'percentValues' },
  ];

  const changeValueHandle = (key: string, value: boolean | string) => {
    let tempOptions = options;
    tempOptions = {
      ...tempOptions,
      [key]: value,
    };
    onChangeOptions(tempOptions);
  };

  return (
    <AppCard>
      <Text as={'h3'} fontWeight={'bold'} fontSize={'24px'} mb={2}>
        Chart options
      </Text>
      <Flex alignItems={'center'} mb={2}>
        <Text mr={2}>Title</Text>
        <AppInput onChange={(e) => changeValueHandle('name', e.target.value)} />
      </Flex>
      <CheckboxGroup>
        {chartOptionsConfigs.map((option) => (
          <Checkbox
            key={option.value}
            value={option.value}
            onChange={(e) => {
              changeValueHandle(option.value, e.target.checked);
            }}
          >
            {option.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </AppCard>
  );
};

const ResultDataConfigs = ({
  axisOptions,
  xAxisMapped,
  yAxesMapped,
  onChangeYAxes,
  onChangeXAxis,
}: {
  xAxisMapped: string;
  yAxesMapped: string[];
  axisOptions: string[];
  onChangeYAxes: (yAxes: string[]) => void;
  onChangeXAxis: (xAxis: string) => void;
}) => {
  const axisOptionsConfigs = useMemo(
    () => ['', ...axisOptions]?.map((axis) => ({ value: axis, label: axis })),
    [axisOptions],
  );

  const changeYAxisHandle = (value: string, oldValue: string) => {
    if (oldValue === '') {
      const tempYAxes = [...yAxesMapped, value];
      return onChangeYAxes(tempYAxes);
    }
    if (value === '' && yAxesMapped.length > 1) {
      const tempYAxes = yAxesMapped.filter((item) => item !== oldValue);
      return onChangeYAxes(tempYAxes);
    }
    const index = yAxesMapped.indexOf(oldValue);
    const tempYAxes = yAxesMapped;
    tempYAxes[index] = value;
    onChangeYAxes(tempYAxes);
  };

  return (
    <AppCard py={4} px={6}>
      <Text as={'h3'} fontWeight={'bold'} fontSize={'24px'} mb={3}>
        Result data
      </Text>
      <Flex alignItems={'center'} justifyContent={'space-between'} mb={2}>
        <Text w={'max-content'} mr={2}>
          X column
        </Text>
        <Box flex={1}>
          <AppSelect2
            options={axisOptionsConfigs.filter(
              (config) => !yAxesMapped.includes(config.value),
            )}
            value={xAxisMapped?.toString() || ''}
            onChange={onChangeXAxis}
          />
        </Box>
      </Flex>
      {[...yAxesMapped, ''].map((axis) => {
        return (
          <Flex
            alignItems={'center'}
            justifyContent={'space-between'}
            key={axis}
          >
            <Text w={'max-content'} mr={2}>
              Y column
            </Text>
            <Box flex={1}>
              <AppSelect2
                width={'100%'}
                options={axisOptionsConfigs.filter(
                  (config) =>
                    !yAxesMapped.includes(config.value) ||
                    axis === config.value,
                )}
                value={axis.toString()}
                onChange={(value) => {
                  changeYAxisHandle(value, axis);
                }}
              />
            </Box>
          </Flex>
        );
      })}
    </AppCard>
  );
};

const XAxisConfigs = ({
  xConfigs,
  onChangeConfigs,
}: {
  xConfigs: XAxisConfigsType;
  onChangeConfigs: (configs: XAxisConfigsType) => void;
}) => {
  const { title } = xConfigs;

  const checkboxConfigs = [
    { label: 'Sort value', value: 'sortX' },
    { label: 'Revert value', value: 'reverseX' },
  ];

  const changeValueHandle = (key: string, value: boolean | string) => {
    let tempOptions = xConfigs;
    tempOptions = {
      ...tempOptions,
      [key]: value,
    };
    onChangeConfigs(tempOptions);
  };
  return (
    <AppCard zIndex={-1}>
      <Text>x-axis options</Text>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Text>Axis title</Text>
        <AppInput
          size={'sm'}
          value={title}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'title'}
        />
      </Flex>
      <CheckboxGroup>
        {checkboxConfigs.map((option) => (
          <Checkbox
            key={option.value}
            value={option.value}
            onChange={(e) => changeValueHandle(option.value, e.target.checked)}
          >
            {option.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </AppCard>
  );
};

const YAxisConfigs = () => {
  return <AppCard>YAxis configs</AppCard>;
};
export default ChartSettings;
