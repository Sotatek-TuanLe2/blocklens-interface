import React, { useEffect, useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { VisualizationOptionsType } from '../../utils/query.type';
import 'src/styles/components/TableConfigurations.scss';
import ChartOptions from './ChartOptions';
import ResultData from './ResultData';
import { XAxisOptions, YAxisOptions } from './AxisOptions';

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
      <Grid
        templateColumns={{
          sm: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gap={'10px'}
      >
        <GridItem>
          <ChartOptions
            options={chartConfigs.chartOptionsConfigs}
            onChangeOptions={(options) => {
              updateState('chartOptionsConfigs', options);
            }}
          />
        </GridItem>
        <GridItem>
          <ResultData
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
          <XAxisOptions
            xConfigs={chartConfigs.xAxisConfigs}
            onChangeConfigs={(configs) => {
              updateState('xAxisConfigs', configs);
            }}
          />
        </GridItem>
        <GridItem>
          <YAxisOptions
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

export default ChartConfigurations;
