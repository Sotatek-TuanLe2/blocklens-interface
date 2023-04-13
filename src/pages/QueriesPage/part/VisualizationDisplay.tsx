import { Box, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import 'src/styles/components/Chart.scss';
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  TableSqlValue,
} from '../../../components/Charts';
import { AppTabs, AppButton, AppSelect2 } from '../../../components';
import ChartSettings from '../../../components/SqlEditor/ChartSettings';
import BaseModal from '../../../modals/BaseModal';
import DashboardsRequest from '../../../requests/DashboardsRequest';
import { useParams } from 'react-router-dom';
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
  QueryType,
  TYPE_VISUALIZATION,
  VALUE_VISUALIZATION,
  VisualizationOptionsType,
  VisualizationType,
} from '../../../utils/visualization.type';

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
  queryValues: unknown[];
  queryInfo: QueryType;
};

const VisualizationDisplay = ({ queryValues, queryInfo }: Props) => {
  const { queryId } = useParams<{ queryId: string }>();
  const [visualizationsActive, setVisualizationsActive] = useState<
    VisualizationType[]
  >([{ id: '1', options: {}, name: 'New Visualization', type: '' }]);
  const [closeTabId, setCloseTabId] = useState('');

  const [configsChart, setConfigsChart] = useState<VisualizationOptionsType>(
    {} as VisualizationOptionsType,
  );
  console.log('configsChart', configsChart.xAxisConfigs.sortX);

  const axisOptions =
    Array.isArray(queryValues) && queryValues[0]
      ? objectKeys(queryValues[0])
      : [];

  const tableValuesColumnConfigs = useMemo(() => {
    return axisOptions.map(
      (col) =>
        ({
          id: col,
          accessorKey: col,
          header: col,
          enableResizing: false,
          size: 100,
        } as ColumnDef<unknown>),
    );
  }, [queryValues]);

  const addVisualizationToQuery = async (
    queryId: string,
    updateQuery: Partial<QueryType>,
  ) => {
    const request = new DashboardsRequest();
    await request.updateQuery(queryId, updateQuery);
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
        options: {},
      };
    } else {
      newVisualization = {
        id: (Math.floor(Math.random() * 100) + 1).toString(),
        name: searchedVisualization.label,
        type: 'chart',
        options: {
          globalSeriesType: searchedVisualization.type,
          columnMapping: {
            xAxis: 'time',
            yAxis: ['number'],
          },
          chartOptionsConfigs: {
            showLegend: true,
          },
        },
      };
    }

    const updateQuery = {
      ...queryInfo,
      visualizations: [...queryInfo.visualizations, newVisualization],
    };
    await addVisualizationToQuery(queryId, updateQuery);
    setVisualizationsActive((prevState) => {
      const [queryResult, ...others] = prevState;
      return [queryResult, newVisualization, ...others];
    });
  };

  const removeVisualizationHandler = async (visualizationId: string) => {
    const visualizationIndex = queryInfo.visualizations.findIndex(
      (v) => v.id.toString() === visualizationId.toString(),
    );
    if (visualizationIndex === -1) return;
    const updateQuery = {
      ...queryInfo,
      visualizations: queryInfo.visualizations.filter(
        (v) => v.id !== visualizationId,
      ),
    };
    await addVisualizationToQuery(queryId, updateQuery);
    setVisualizationsActive([
      ...updateQuery.visualizations,
      {
        id: 'newVisualization',
        options: {},
        name: 'New Visualization',
        type: 'newVisualization',
      },
    ]);
  };

  useEffect(() => {
    setVisualizationsActive([
      ...queryInfo.visualizations,
      {
        id: 'newVisualization',
        options: {},
        name: 'New Visualization',
        type: 'newVisualization',
      },
    ]);
  }, []);

  const renderVisualization = (visualization: VisualizationType) => {
    const type = visualization.options?.globalSeriesType || visualization.type;
    switch (type) {
      case TYPE_VISUALIZATION.table:
        return (
          <TableSqlValue
            columns={tableValuesColumnConfigs}
            data={queryValues}
          />
        );
      case TYPE_VISUALIZATION.line: {
        return (
          <>
            <LineChart
              data={queryValues}
              xAxisKey="time"
              yAxisKeys={['size']}
            />
            <ChartSettings
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
            <BarChart
              data={
                configsChart?.xAxisConfigs.sortX
                  ? queryValues.sort(
                      (a, b) =>
                        a[configsChart.columnMapping.xAxis] -
                        b[configsChart.columnMapping.xAxis],
                    )
                  : queryValues
              }
              xAxisKey={configsChart?.columnMapping?.xAxis || 'time'}
              yAxisKeys={configsChart.columnMapping?.yAxis || ['size']}
              configs={configsChart}
            />
            <ChartSettings
              axisOptions={axisOptions as string[]}
              configs={visualization.options as VisualizationOptionsType}
              onChangeConfigs={setConfigsChart}
            />
          </>
        );
      case TYPE_VISUALIZATION.area:
        return (
          <>
            <AreaChart
              data={queryValues}
              xAxisKey="time"
              yAxisKeys={['size']}
            />
            <ChartSettings
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
            <PieChart data={queryValues} dataKey={'number'} />;
            <ChartSettings
              axisOptions={axisOptions as string[]}
              configs={visualization.options as VisualizationOptionsType}
              onChangeConfigs={(configs) => {
                console.log('configs', configs);
              }}
            />
          </>
        );

      case TYPE_VISUALIZATION.scatter: {
        return (
          <>
            <ScatterChart
              data={queryValues}
              xAxisKey={'number'}
              yAxisKeys={['size']}
            />
            <ChartSettings
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
        tabs={visualizationsActive.map((v) => ({
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
