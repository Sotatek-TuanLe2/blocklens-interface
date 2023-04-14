import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { AppInput, AppSelect2 } from '../index';
import {
  ChartOptionConfigsType,
  VisualizationOptionsType,
  XAxisConfigsType,
  YAxisConfigsType,
} from '../../utils/visualization.type';
import 'src/styles/components/TableConfigurations.scss';

type Props = {
  configs: VisualizationOptionsType;
  onChangeConfigs: (configs: VisualizationOptionsType) => void;
  axisOptions: string[];
};
const ChartConfigurations = ({
  axisOptions,
  configs,
  onChangeConfigs,
}: Props) => {
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
    <div className={'main-layout'}>
      <Grid templateColumns={'repeat(2,1fr)'} gap={'10px'}>
        <GridItem>
          <ChartOptions
            options={chartConfigs.chartOptionsConfigs}
            onChangeOptions={(options) => {
              updateState('chartOptionsConfigs', options);
            }}
          />
        </GridItem>
        <GridItem>
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
        </GridItem>
        <GridItem>
          <XAxisConfigs
            xConfigs={chartConfigs.xAxisConfigs}
            onChangeConfigs={(configs) => {
              updateState('xAxisConfigs', configs);
            }}
          />
        </GridItem>
        <GridItem>
          <YAxisConfigs
            yConfigs={chartConfigs.yAxisConfigs}
            onChangeConfigs={(configs) => {
              updateState('yAxisConfigs', configs);
            }}
          />
        </GridItem>
      </Grid>
    </div>
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
    <div className={'box-table first-box-table'}>
      <Text
        as={'h3'}
        className={'box-table__title'}
        fontWeight={'bold'}
        mb={'10px'}
      >
        Chart options
      </Text>
      <Flex alignItems={'center'} mb={2} className={'box-table-children'}>
        <div>Title</div>
        <AppInput
          className={'input-table'}
          value={options?.name || ''}
          onChange={(e) => changeValueHandle('name', e.target.value)}
          size={'sm'}
        />
      </Flex>
      <CheckboxGroup>
        {chartOptions.map((option) => {
          return (
            <div className={'main-checkbox'}>
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
            </div>
          );
        })}
      </CheckboxGroup>
    </div>
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
    <div className={'box-table'}>
      <Text
        as={'h3'}
        className={'box-table__title'}
        fontWeight={'bold'}
        mb={'10px'}
      >
        x-axis options
      </Text>
      <div className={'box-table-children'}>
        <Text>Axis title</Text>
        <AppInput
          className={'input-table'}
          value={xConfigs?.title || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'title'}
        />
      </div>
      <CheckboxGroup>
        {checkboxConfigs.map((option) => (
          <div className={'main-checkbox'}>
            <Checkbox
              key={option.value}
              value={option.value}
              onChange={(e) =>
                changeValueHandle(option.value, e.target.checked)
              }
            >
              {option.label}
            </Checkbox>
          </div>
        ))}
      </CheckboxGroup>
    </div>
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
    <div className={'box-table'}>
      <Text
        as={'h3'}
        className={'box-table__title'}
        fontWeight={'bold'}
        mb={'10px'}
      >
        y-axis options
      </Text>
      <div className={'box-table-children'}>
        <Text>Axis title</Text>
        <AppInput
          className={'input-table'}
          value={yConfigs?.title || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'title'}
        />
      </div>
      <div className={'main-checkbox'}>
        <Checkbox
          value={'logarithmic'}
          name={'logarithmic'}
          onChange={(e) => changeValueHandle(e.target.name, e.target.checked)}
        >
          {'Logarithmic'}
        </Checkbox>
      </div>
      <div className={'box-table-children'}>
        <Text>Tick format</Text>
        <AppInput
          className={'input-table'}
          size={'sm'}
          value={yConfigs?.tickFormat || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'tickFormat'}
        />
      </div>
      <div className={'box-table-children'}>
        <Text>Label format</Text>
        <AppInput
          className={'input-table'}
          size={'sm'}
          value={yConfigs?.labelFormat || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'labelFormat'}
        />
      </div>
    </div>
  );
};
export default ChartConfigurations;
