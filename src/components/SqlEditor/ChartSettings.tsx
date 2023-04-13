import React, { useEffect, useMemo, useState } from 'react';
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
  VisualizationOptionsType,
  XAxisConfigsType,
  YAxisConfigsType,
} from '../../utils/visualization.type';
import 'src/styles/components/ChartSettings.scss';

type Props = {
  configs: VisualizationOptionsType;
  onChangeConfigs: (configs: VisualizationOptionsType) => void;
};
const ChartSettings = ({ configs, onChangeConfigs }: Props) => {
  const [chartConfigs, setChartConfigs] = useState<VisualizationOptionsType>({
    chartOptionsConfigs: {} as ChartOptionConfigsType,
    xAxisConfigs: {} as XAxisConfigsType,
    yAxisConfigs: {} as YAxisConfigsType,
    columnMapping: {
      xAxis: 'time',
      yAxis: ['size'],
    },
  } as VisualizationOptionsType);

  useEffect(() => {
    setChartConfigs(configs);
  }, []);

  const updateState = (prop: string, value: unknown) => {
    const tempConfigs = {
      ...chartConfigs,
      [prop]: value,
    };
    setChartConfigs(tempConfigs);
    onChangeConfigs(tempConfigs);
  };

  return (
    <VStack spacing={'24px'} className={'chart-settings'}>
      <ChartOptions
        options={chartConfigs.chartOptionsConfigs}
        onChangeOptions={(options) => {
          updateState('chartOptionsConfigs', options);
        }}
      />
      <ResultDataConfigs
        axisOptions={['time', 'number', 'size', 'hash']}
        xAxisMapped={chartConfigs.columnMapping.xAxis}
        yAxesMapped={chartConfigs.columnMapping.yAxis}
        onChangeXAxis={(xAxis) => {
          updateState('columnMapping', {
            ...chartConfigs.columnMapping,
            xAxis,
          });
        }}
        onChangeYAxes={(yAxes) => {
          updateState('columnMapping', {
            ...chartConfigs.columnMapping,
            yAxis: yAxes,
          });
        }}
      />
      <XAxisConfigs
        xConfigs={chartConfigs.xAxisConfigs}
        onChangeConfigs={(configs) => {
          console.log('configs', configs);
          updateState('xAxisConfigs', configs);
        }}
      />
      <YAxisConfigs
        yConfigs={chartConfigs.yAxisConfigs}
        onChangeConfigs={(configs) => {
          updateState('yAxisConfigs', configs);
        }}
      />
    </VStack>
  );
};

const ChartOptions = ({
  options,
  onChangeOptions,
}: {
  options: Partial<ChartOptionConfigsType>;
  onChangeOptions: (options: Partial<ChartOptionConfigsType>) => void;
}) => {
  const chartOptionsConfigs = [
    { label: 'Show chart legend', value: 'showLegend' },
    { label: 'Enable stacking', value: 'stacking' },
    { label: 'Normalize to percentage', value: 'percentValues' },
  ];

  const changeValueHandle = (key: string, value: boolean | string) => {
    let tempOptions = options;
    console.log('key show VisualizationBarChart', key, value);
    tempOptions = {
      ...tempOptions,
      [key]: value,
    };
    onChangeOptions(tempOptions);
  };

  return (
    <AppCard>
      <Text as={'h3'} className={'chart-settings__title'}>
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
              console.log(
                'e.target.checked show VisualizationBarChart',
                e.target.checked,
              );
              // console.log('option.value', option.value);
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
      <Text as={'h3'} className={'chart-settings__title'}>
        Result data
      </Text>
      <Flex alignItems={'center'} justifyContent={'space-between'} mb={2}>
        <Text w={'max-content'} mr={2}>
          X column
        </Text>
        <Box flex={1}>
          <AppSelect2
            zIndex={1001}
            options={axisOptionsConfigs.filter(
              (config) => !yAxesMapped.includes(config.value),
            )}
            value={xAxisMapped?.toString() || ''}
            onChange={onChangeXAxis}
          />
        </Box>
      </Flex>
      {[...yAxesMapped, ''].map((axis, index) => {
        return (
          <Flex
            mt={2}
            width={'100%'}
            alignItems={'center'}
            justifyContent={'space-between'}
            key={axis}
          >
            <Text w={'max-content'} mr={2}>
              Y column
            </Text>
            <Box flex={1}>
              <AppSelect2
                zIndex={1000 - index}
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
    <AppCard>
      <Text as={'h3'} className={'chart-settings__title'}>
        x-axis options
      </Text>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Text>Axis title</Text>
        <AppInput
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

const YAxisConfigs = ({
  yConfigs,
  onChangeConfigs,
}: {
  yConfigs: YAxisConfigsType;
  onChangeConfigs: (configs: YAxisConfigsType) => void;
}) => {
  const { title, labelFormat, tickFormat } = yConfigs;

  const changeValueHandle = (key: string, value: boolean | string) => {
    let tempOptions = yConfigs;
    tempOptions = {
      ...tempOptions,
      [key]: value,
    };
    console.log('temOptions VisualizationBarChart', tempOptions);
    onChangeConfigs(tempOptions);
  };
  return (
    <AppCard>
      <Text as={'h3'} className={'chart-settings__title'}>
        y-axis options
      </Text>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Text>Axis title</Text>
        <AppInput
          value={title}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'title'}
        />
      </Flex>
      <Checkbox
        value={'logarithmic'}
        name={'logarithmic'}
        onChange={(e) => changeValueHandle(e.target.name, e.target.checked)}
      >
        {'Logarithmic'}
      </Checkbox>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Text>Tick format</Text>
        <AppInput
          size={'sm'}
          value={tickFormat}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'tickFormat'}
        />
      </Flex>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Text>Label format</Text>
        <AppInput
          size={'sm'}
          value={labelFormat}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'labelFormat'}
        />
      </Flex>
    </AppCard>
  );
};
export default ChartSettings;
