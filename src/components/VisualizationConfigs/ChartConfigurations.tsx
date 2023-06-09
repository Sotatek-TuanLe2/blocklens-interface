import React, { useMemo, useRef, useState } from 'react';
import { Grid, GridItem, Text } from '@chakra-ui/react';
import { TYPE_VISUALIZATION, VisualizationType } from '../../utils/query.type';
import 'src/styles/components/TableConfigurations.scss';
import ChartOptions from './ChartOptions';
import ResultData from './ResultData';
import { XAxisOptions, YAxisOptions } from './AxisOptions';
import { objectKeys } from 'src/utils/utils-network';
import { VISUALIZATION_DEBOUNCE } from 'src/pages/WorkspacePage/parts/VisualizationDisplay';
import AppInput from '../AppInput';

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
  const timeout = useRef() as any;

  const type = visualization.options?.globalSeriesType || visualization.type;

  const axisOptions = useMemo(
    () => (Array.isArray(data) && data[0] ? objectKeys(data[0]) : []),
    [data],
  );

  const onChangeDebounce = (visualization: VisualizationType) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      onChangeConfigurations(visualization);
    }, VISUALIZATION_DEBOUNCE);
  };

  const onChangeVisualization = (visualization: VisualizationType) => {
    setEditVisualization(visualization);
    onChangeDebounce(visualization);
  };

  return (
    <div className={'main-layout theme-background'}>
      <Grid
        templateColumns={{
          sm: 'repeat(1, 1fr)',
          md: 'repeat(1, 1fr)',
        }}
      >
        <GridItem>
          <ChartOptions
            visualization={editVisualization}
            onChangeConfigurations={(visualization) =>
              onChangeVisualization(visualization)
            }
          />
        </GridItem>
        <GridItem>
          <ResultData
            axisOptions={axisOptions as string[]}
            xAxis={editVisualization.options?.columnMapping?.xAxis}
            yAxis={editVisualization.options?.columnMapping?.yAxis}
            onChangeAxis={(xAxis: string, yAxis: string[]) => {
              onChangeVisualization({
                ...editVisualization,
                options: {
                  ...editVisualization.options,
                  columnMapping: {
                    ...editVisualization.options.columnMapping,
                    xAxis,
                    yAxis,
                  },
                },
              });
            }}
          />
        </GridItem>
        {type === TYPE_VISUALIZATION.pie ? (
          <GridItem>
            <div className="box-table">
              <Text
                className="box-table__title"
                fontWeight="bold"
                marginBottom="10px"
              >
                Pie options
              </Text>
              <div className="box-table-children grid-pie">
                <div className="label-input">Label format</div>
                <AppInput
                  placeholder="0.0"
                  size={'sm'}
                  className="input-table"
                  value={editVisualization?.options?.numberFormat}
                  onChange={(e) =>
                    onChangeVisualization({
                      ...editVisualization,
                      options: {
                        ...editVisualization.options,
                        numberFormat: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </GridItem>
        ) : (
          <>
            <GridItem>
              <XAxisOptions
                chartOptions={editVisualization.options.chartOptionsConfigs}
                xConfigs={editVisualization.options.xAxisConfigs}
                onChangeConfigs={(configs) => {
                  onChangeVisualization({
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
                chartOptions={editVisualization.options.chartOptionsConfigs}
                yConfigs={editVisualization.options.yAxisConfigs}
                onChangeConfigs={(configs) => {
                  onChangeVisualization({
                    ...editVisualization,
                    options: {
                      ...editVisualization.options,
                      yAxisConfigs: configs,
                    },
                  });
                }}
              />
            </GridItem>
          </>
        )}
      </Grid>
    </div>
  );
};

export default ChartConfigurations;
