import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import 'src/styles/components/Chart.scss';
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  VisualizationTable,
} from '../../../components/Charts';
import { AppTabs, AppButton, AppSelect2 } from '../../../components';
import ChartConfigurations from '../../../components/VisualizationConfigs/ChartConfigurations';
import BaseModal from '../../../modals/BaseModal';
import DashboardsRequest from '../../../requests/DashboardsRequest';
import { ColumnDef } from '@tanstack/react-table';
import { objectKeys } from '../../../utils/utils-network';
import {
  AreaChartIcon,
  BarChartIcon,
  LineChartIcon,
  PieChartIcon,
  QueryResultIcon,
  ScatterChartIcon,
} from 'src/assets/icons';
import {
  IQuery,
  TYPE_VISUALIZATION,
  VALUE_VISUALIZATION,
  VisualizationOptionsType,
  VisualizationType,
} from '../../../utils/query.type';
import TableConfigurations from '../../../components/VisualizationConfigs/TableConfigurations';
import moment from 'moment';

type VisualizationConfigType = {
  value: string;
  label: string;
  type: string;
};

const visualizationConfigs: VisualizationConfigType[] = [
  {
    label: 'Bar chart',
    type: TYPE_VISUALIZATION.bar,
    value: VALUE_VISUALIZATION.bar,
  },
  {
    label: 'Line chart',
    type: TYPE_VISUALIZATION.line,
    value: VALUE_VISUALIZATION.line,
  },
  {
    label: 'Area chart',
    type: TYPE_VISUALIZATION.area,
    value: VALUE_VISUALIZATION.area,
  },
  {
    label: 'Pie chart',
    type: TYPE_VISUALIZATION.pie,
    value: VALUE_VISUALIZATION.pie,
  },
  {
    label: 'Scatter chart',
    type: TYPE_VISUALIZATION.scatter,
    value: VALUE_VISUALIZATION.scatter,
  },
];

type Props = {
  queryResult: unknown[];
  queryValue: IQuery;
  onReload: () => Promise<void>;
};

const VisualizationDisplay = ({ queryResult, queryValue, onReload }: Props) => {
  const [visualizations, setVisualizations] = useState<VisualizationType[]>([]);
  const [closeTabId, setCloseTabId] = useState<string | number>('');

  const [configsChart, setConfigsChart] = useState<VisualizationOptionsType>(
    {} as VisualizationOptionsType,
  );

  useEffect(() => {
    setVisualizations([...queryValue.visualizations]);
    setConfigsChart(
      (queryValue.visualizations[0]?.options as VisualizationOptionsType) ||
        ({} as VisualizationOptionsType),
    );
  }, [queryValue]);

  const axisOptions =
    Array.isArray(queryResult) && queryResult[0]
      ? objectKeys(queryResult[0])
      : [];

  const updateQuery = async (updateQuery: IQuery) => {
    const request = new DashboardsRequest();
    await request.updateQuery(queryValue.id, updateQuery);
    await onReload();
  };

  const addVisualizationHandler = async (visualizationValue: string) => {
    const searchedVisualization = visualizationConfigs.find(
      (v) => v.value === visualizationValue,
    );
    if (!searchedVisualization) return;
    let newVisualization: VisualizationType = {} as VisualizationType;
    if (searchedVisualization.type === TYPE_VISUALIZATION.table) {
      newVisualization = {
        name: 'Query results',
        id: (Math.floor(Math.random() * 100) + 1).toString(),
        type: 'table',
        createdAt: moment().toDate(),
        options: {},
      };
    } else {
      newVisualization = {
        id: (Math.floor(Math.random() * 100) + 1).toString(),
        name: searchedVisualization.label,
        type: 'chart',
        createdAt: moment().toDate(),
        options: {
          globalSeriesType: searchedVisualization.type,
          columnMapping: {
            xAxis: 'time',
            yAxis: ['size'],
          },
          chartOptionsConfigs: {
            showLegend: true,
          },
        },
      };
    }

    const [queryResult, ...others] = visualizations;
    const newQuery: IQuery = {
      ...queryValue,
      visualizations: [queryResult, newVisualization, ...others],
    };
    await updateQuery(newQuery);
  };

  const removeVisualizationHandler = async (
    visualizationId: string | number,
  ) => {
    const visualizationIndex = queryValue.visualizations.findIndex(
      (v) => v.id.toString() === visualizationId.toString(),
    );
    if (visualizationIndex === -1) return;
    const newQuery = {
      ...queryValue,
      visualizations: queryValue.visualizations.filter(
        (v) => v.id !== visualizationId,
      ),
    };
    await updateQuery(newQuery);
  };

  const renderVisualization = (visualization: VisualizationType) => {
    const type = visualization.options?.globalSeriesType || visualization.type;
    switch (type) {
      case TYPE_VISUALIZATION.table:
        const columns =
          Array.isArray(queryResult) && queryResult[0]
            ? objectKeys(queryResult[0])
            : [];
        const tableValuesColumnConfigs = columns.map(
          (col) =>
            ({
              id: col,
              accessorKey: col,
              header: col,
              enableResizing: true,
              size: 100,
              align: 'left',
              type: 'normal',
              format: '',
              coloredPositive: false,
              coloredNegative: false,
              coloredProgress: false,
              isHidden: false,
            } as ColumnDef<unknown>),
        );

        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {configsChart?.chartOptionsConfigs?.name}
              </div>
              <VisualizationTable
                columns={tableValuesColumnConfigs}
                data={queryResult}
              />
            </div>
            <TableConfigurations />
          </>
        );
      case TYPE_VISUALIZATION.line: {
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {configsChart?.chartOptionsConfigs?.name}
              </div>
              <LineChart
                data={queryResult}
                xAxisKey="time"
                yAxisKeys={['size']}
              />
            </div>
            <ChartConfigurations
              axisOptions={axisOptions as string[]}
              configs={visualization.options as VisualizationOptionsType}
              onChangeConfigs={(configs) => {
                console.log('configs', configs);
              }}
            />
          </>
        );
      }
      case TYPE_VISUALIZATION.bar:
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {configsChart?.chartOptionsConfigs?.name}
              </div>
              <BarChart
                data={
                  configsChart?.xAxisConfigs?.sortX
                    ? queryResult.sort(
                        (a, b) =>
                          a[configsChart.columnMapping.xAxis] -
                          b[configsChart.columnMapping.xAxis],
                      )
                    : queryResult
                }
                xAxisKey={configsChart?.columnMapping?.xAxis || 'time'}
                yAxisKeys={configsChart.columnMapping?.yAxis || ['size']}
                configs={configsChart}
              />
            </div>
            <ChartConfigurations
              axisOptions={axisOptions as string[]}
              configs={configsChart as VisualizationOptionsType}
              onChangeConfigs={setConfigsChart}
            />
          </>
        );
      case TYPE_VISUALIZATION.area:
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {configsChart?.chartOptionsConfigs?.name}
              </div>
              <AreaChart
                data={queryResult}
                xAxisKey="time"
                yAxisKeys={['size']}
              />
            </div>
            <ChartConfigurations
              axisOptions={axisOptions as string[]}
              configs={visualization.options as VisualizationOptionsType}
              onChangeConfigs={(configs) => {
                console.log('configs', configs);
              }}
            />
          </>
        );
      case TYPE_VISUALIZATION.pie:
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {configsChart?.chartOptionsConfigs?.name}
              </div>
              <PieChart data={queryResult} dataKey={'number'} />;
            </div>
            <ChartConfigurations
              axisOptions={axisOptions as string[]}
              configs={
                objectKeys(configsChart).length > 0
                  ? configsChart
                  : (visualization.options as VisualizationOptionsType)
              }
              onChangeConfigs={(configs) => {
                console.log('configs', configs);
              }}
            />
          </>
        );

      case TYPE_VISUALIZATION.scatter: {
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {configsChart?.chartOptionsConfigs?.name}
              </div>
              <ScatterChart
                data={queryResult}
                xAxisKey={'number'}
                yAxisKeys={['size']}
              />
            </div>
            <ChartConfigurations
              axisOptions={axisOptions as string[]}
              configs={visualization.options as VisualizationOptionsType}
              onChangeConfigs={(configs) => {
                console.log('configs', configs);
              }}
            />
          </>
        );
      }

      default:
        return <AddVisualization onAddVisualize={addVisualizationHandler} />;
    }
  };

  const getIcon = (chain: string | undefined) => {
    switch (chain) {
      case TYPE_VISUALIZATION.table:
        return <QueryResultIcon />;

      case TYPE_VISUALIZATION.scatter:
        return <ScatterChartIcon />;

      case TYPE_VISUALIZATION.area:
        return <AreaChartIcon />;

      case TYPE_VISUALIZATION.line: {
        return <LineChartIcon />;
      }

      case TYPE_VISUALIZATION.pie:
        return <PieChartIcon />;

      case TYPE_VISUALIZATION.bar:
        return <BarChartIcon />;

      default:
        return <></>;
    }
  };

  return (
    <Box className="visual-container">
      <AppTabs
        onCloseTab={(tabId: string) => {
          setCloseTabId(tabId);
        }}
        onChange={(tabId: string) => {
          const visualization = visualizations.find((v) => v.id === tabId);
          if (visualization) {
            setConfigsChart(visualization.options as VisualizationOptionsType);
          }
        }}
        tabs={[
          ...visualizations,
          {
            id: 'newVisualization',
            createdAt: moment().toDate(),
            options: {},
            name: 'New Visualization',
            type: 'newVisualization',
          },
        ].map((v) => ({
          icon: getIcon(v.options.globalSeriesType || v.type),
          name: v.name,
          content: renderVisualization(v),
          id: v.id,
          closeable: v.type !== 'newVisualization',
        }))}
      />

      <BaseModal
        title={'Remove visualization'}
        description={'Are you sure you want to remove this visualization?'}
        isOpen={closeTabId !== ''}
        onClose={() => setCloseTabId('')}
        onActionLeft={() => setCloseTabId('')}
        onActionRight={() => {
          removeVisualizationHandler(closeTabId);
          setCloseTabId('');
        }}
      >
        <></>
      </BaseModal>
    </Box>
  );
};

export default VisualizationDisplay;

type AddVisualizationProps = {
  onAddVisualize: (visualizationValue: string) => void;
};

const AddVisualization = ({ onAddVisualize }: AddVisualizationProps) => {
  const [visualizationSelected, setVisualizationSelected] = useState<string>(
    VALUE_VISUALIZATION.bar,
  );
  return (
    <Box>
      <Text mb={2}>Select visualization type</Text>
      <Box className="select-visual-type">
        <AppSelect2
          options={visualizationConfigs}
          value={visualizationSelected || ''}
          onChange={(value) => setVisualizationSelected(value)}
          className="visual-type-content"
        />
      </Box>

      <AppButton
        mt={4}
        onClick={() => {
          if (!visualizationSelected) return;
          onAddVisualize(visualizationSelected);
        }}
      >
        Add visualization
      </AppButton>
    </Box>
  );
};
