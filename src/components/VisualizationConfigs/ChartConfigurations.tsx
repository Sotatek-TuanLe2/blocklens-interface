import React, { useEffect, useMemo, useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { VisualizationType } from '../../utils/query.type';
import 'src/styles/components/TableConfigurations.scss';
import ChartOptions from './ChartOptions';
import ResultData from './ResultData';
import { XAxisOptions, YAxisOptions } from './AxisOptions';
import { objectKeys } from 'src/utils/utils-network';
import { VISUALIZATION_DEBOUNCE } from 'src/pages/QueriesPage/part/VisualizationDisplay';

type Props = {
  data: unknown[];
  visualization: VisualizationType;
  onChangeConfigurations: (v: VisualizationType) => void;
};

const ChartConfigurations = ({
  data,
  visualization,
  onChangeConfigurations,
}: Props) => {
  const [editVisualization, setEditVisualization] =
    useState<VisualizationType>(visualization);
  let timeout: any = null;

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      onChangeConfigurations(editVisualization);
    }, VISUALIZATION_DEBOUNCE);

    return () => clearTimeout(timeout);
  }, [editVisualization]);

  const axisOptions = useMemo(
    () => (Array.isArray(data) && data[0] ? objectKeys(data[0]) : []),
    [data],
  );

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
            visualization={editVisualization}
            onChangeConfigurations={(visualization) =>
              setEditVisualization(visualization)
            }
          />
        </GridItem>
        <GridItem>
          <ResultData
            axisOptions={axisOptions as string[]}
            xAxisMapped={
              editVisualization.options?.columnMapping?.xAxis || 'time'
            }
            yAxesMapped={
              editVisualization.options?.columnMapping?.yAxis || ['size']
            }
            onChangeXAxis={(xAxis) => {
              setEditVisualization({
                ...editVisualization,
                options: {
                  ...editVisualization.options,
                  columnMapping: {
                    ...editVisualization.options.columnMapping,
                    xAxis,
                  },
                },
              });
            }}
            onChangeYAxis={(yAxis) => {
              setEditVisualization({
                ...editVisualization,
                options: {
                  ...editVisualization.options,
                  columnMapping: {
                    ...editVisualization.options.columnMapping,
                    yAxis,
                  },
                },
              });
            }}
          />
        </GridItem>
        <GridItem>
          <XAxisOptions
            xConfigs={editVisualization.options.xAxisConfigs}
            onChangeConfigs={(configs) => {
              setEditVisualization({
                ...editVisualization,
                options: {
                  ...editVisualization.options,
                  xAxisConfigs: configs,
                },
              });
            }}
          />
        </GridItem>
        <GridItem>
          <YAxisOptions
            yConfigs={editVisualization.options.yAxisConfigs}
            onChangeConfigs={(configs) => {
              setEditVisualization({
                ...editVisualization,
                options: {
                  ...editVisualization.options,
                  yAxisConfigs: configs,
                },
              });
            }}
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default ChartConfigurations;
