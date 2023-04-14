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
  axisOptions: string[];
};
const ChartSettings = ({ axisOptions, configs, onChangeConfigs }: Props) => {
  const [chartConfigs, setChartConfigs] = useState<VisualizationOptionsType>(
    {} as VisualizationOptionsType,
  );

  useEffect(() => {
    setChartConfigs(configs);
  }, [configs]);

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
        axisOptions={axisOptions}
        xAxisMapped={chartConfigs?.columnMapping?.xAxis || 'time'}
        yAxesMapped={chartConfigs?.columnMapping?.yAxis || ['size']}
        onChangeXAxis={(xAxis) => {
          updateState('columnMapping', {
            ...chartConfigs?.columnMapping,
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
  const [chartOptions, setChartOptions] = useState([
    {
      label: 'Show chart legend',
      value: 'showLegend',
      checked: true,
    },
    { label: 'Enable stacking', value: 'stacking', checked: false },
    {
      label: 'Normalize to percentage',
      value: 'percentValues',
      checked: false,
    },
  ]);
  useEffect(() => {
    console.log('ooptions', options);
    setChartOptions([
      {
        label: 'Show chart legend',
        value: 'showLegend',
        checked: options?.showLegend || false,
      },
      {
        label: 'Enable stacking',
        value: 'stacking',
        checked: options?.stacking || false,
      },
      {
        label: 'Normalize to percentage',
        value: 'percentValues',
        checked: options?.percentValues || false,
      },
    ]);
  }, [options]);

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
      <Text as={'h3'} className={'chart-settings__title'}>
        Chart options
      </Text>
      <Flex alignItems={'center'} mb={2}>
        <Text mr={2}>Title</Text>
        <AppInput
          value={options?.name || ''}
          onChange={(e) => changeValueHandle('name', e.target.value)}
        />
      </Flex>
      <CheckboxGroup>
        {chartOptions.map((option) => {
          return (
            <Checkbox
              key={option.value}
              name={option.value}
              isChecked={option.checked}
              onChange={(e) => {
                changeValueHandle(option.value, e.target.checked);
              }}
            >
              {option.label}
            </Checkbox>
          );
        })}
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
  const [configs, setConfigs] = useState({
    xAxis: xAxisMapped,
    yAxis: yAxesMapped,
  });

  const axisOptionsConfigs = useMemo(
    () => ['', ...axisOptions]?.map((axis) => ({ value: axis, label: axis })),
    [axisOptions],
  );
  useEffect(() => {
    console.log('configs', configs);
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
      return onChangeYAxes(tempYAxes);
    }
    if (value === '' && configs.yAxis?.length <= 1) {
      const tempYAxes = configs.yAxis.filter((item) => item !== oldValue);
      return onChangeYAxes(tempYAxes);
    }
    const index = configs.yAxis.indexOf(oldValue);
    const tempYAxes = configs.yAxis;
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
            options={axisOptionsConfigs?.filter((config) => {
              if (configs.yAxis?.length > 0) {
                return !configs.yAxis?.includes(config.value);
              }
              return true;
            })}
            value={configs.xAxis?.toString() || ''}
            onChange={onChangeXAxis}
          />
        </Box>
      </Flex>
      {(configs.yAxis ? [...configs.yAxis, ''] : ['']).map((axis, index) => {
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
          value={xConfigs?.title || ''}
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
  const changeValueHandle = (key: string, value: boolean | string) => {
    let tempOptions = yConfigs;
    tempOptions = {
      ...tempOptions,
      [key]: value,
    };
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
          value={yConfigs?.title || ''}
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
          value={yConfigs?.tickFormat || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'tickFormat'}
        />
      </Flex>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Text>Label format</Text>
        <AppInput
          size={'sm'}
          value={yConfigs?.labelFormat || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'labelFormat'}
        />
      </Flex>
    </AppCard>
  );
};
export default ChartSettings;
