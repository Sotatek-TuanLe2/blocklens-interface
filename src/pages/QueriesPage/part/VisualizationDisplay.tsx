import { Box, Flex, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
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
  VisualizationType,
} from '../../../utils/query.type';
import TableConfigurations from '../../../components/VisualizationConfigs/TableConfigurations';
import moment from 'moment';
import VisualizationCounter from 'src/components/Charts/VisualizationCounter';
import CounterConfiguration from 'src/components/VisualizationConfigs/CounterConfiguration';
import { defaultTableColumn } from 'src/components/Charts/VisualizationTable';

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
  {
    label: 'Counter',
    type: TYPE_VISUALIZATION.counter,
    value: VALUE_VISUALIZATION.counter,
  },
];

export const VISUALIZATION_DEBOUNCE = 500;

type Props = {
  queryResult: unknown[];
  queryValue: IQuery;
  onReload: () => Promise<void>;
};

const VisualizationDisplay = ({ queryResult, queryValue, onReload }: Props) => {
  const [closeTabId, setCloseTabId] = useState<string | number>('');
  const [dataTable, setDataTable] = useState<any[]>([]);

  const optionsColumn = defaultTableColumn(queryResult);

  const defaultTimeXAxis = useMemo(() => {
    let result = '';
    const firstResultInQuery =
      queryResult && !!queryResult.length ? queryResult[0] : null;
    if (firstResultInQuery) {
      Object.keys(firstResultInQuery).forEach((key: string) => {
        const date = moment(firstResultInQuery[key]);
        if (date.isValid()) {
          result = key;
          return;
        }
      });
    }
    return result;
  }, [queryResult]);

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
        options: { optionsColumn },
      };
    } else if (searchedVisualization.type === TYPE_VISUALIZATION.counter) {
      newVisualization = {
        name: 'Counter',
        id: (Math.floor(Math.random() * 100) + 1).toString(),
        type: 'counter',
        createdAt: moment().toDate(),
        options: {
          counterColName: 'time',
          rowNumber: 1,
        },
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
            xAxis: defaultTimeXAxis,
            yAxis: [],
          },
          chartOptionsConfigs: {
            showLegend: true,
          },
        },
      };
    }

    const [queryResult, ...others] = queryValue.visualizations;
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

  const onChangeConfigurations = (visualization: VisualizationType) => {
    const index = queryValue.visualizations.findIndex(
      (v) => v.id === visualization.id,
    );
    if (index >= 0) {
      const newQuery = { ...queryValue };
      newQuery.visualizations[index] = visualization;
      updateQuery(newQuery);
    }
  };

  const renderVisualization = (visualization: VisualizationType) => {
    const type = visualization.options?.globalSeriesType || visualization.type;
    let data = [...queryResult];
    if (visualization.options.xAxisConfigs?.sortX) {
      data = data.sort((a: any, b: any) => {
        if (moment(a[visualization.options.columnMapping.xAxis]).isValid()) {
          return moment
            .utc(a[visualization.options.columnMapping.xAxis])
            .diff(moment.utc(b[visualization.options.columnMapping.xAxis]));
        }
        return (
          a[visualization.options.columnMapping.xAxis] -
          b[visualization.options.columnMapping.xAxis]
        );
      });
    }
    if (visualization.options.xAxisConfigs?.reverseX) {
      data = data.reverse();
    }

    if (type === TYPE_VISUALIZATION.new) {
      return <AddVisualization onAddVisualize={addVisualizationHandler} />;
    }

    let errorMessage = null;
    let visualizationDisplay = null;
    let visualizationConfiguration = null;

    if (!visualization.options.columnMapping?.xAxis) {
      errorMessage = 'Missing x-axis';
    } else if (!visualization.options.columnMapping?.yAxis.length) {
      errorMessage = 'Missing y-axis';
    } else {
      // TODO: check yAxis values have same type
    }

    if (type === TYPE_VISUALIZATION.table) {
      errorMessage = null;
      visualizationDisplay = (
        <VisualizationTable
          data={queryResult}
          setDataTable={setDataTable}
          dataColumn={visualization.options.columns}
        />
      );
      visualizationConfiguration = (
        <TableConfigurations
          visualization={visualization}
          onChangeConfigurations={onChangeConfigurations}
          dataTable={dataTable}
        />
      );
    } else if (type === TYPE_VISUALIZATION.counter) {
      errorMessage = null;
      visualizationDisplay = (
        <VisualizationCounter
          data={queryResult}
          visualization={visualization}
        />
      );
      visualizationConfiguration = (
        <CounterConfiguration
          data={queryResult}
          visualization={visualization}
          onChangeConfigurations={onChangeConfigurations}
        />
      );
    } else {
      // chart
      visualizationConfiguration = (
        <ChartConfigurations
          data={queryResult}
          visualization={visualization}
          onChangeConfigurations={onChangeConfigurations}
        />
      );
      switch (type) {
        case TYPE_VISUALIZATION.bar:
          visualizationDisplay = (
            <BarChart
              data={data}
              xAxisKey={
                visualization.options?.columnMapping?.xAxis || defaultTimeXAxis
              }
              yAxisKeys={visualization.options.columnMapping?.yAxis || []}
              configs={visualization.options}
            />
          );
          break;
        case TYPE_VISUALIZATION.line:
          visualizationDisplay = (
            <LineChart
              data={data}
              xAxisKey={
                visualization.options?.columnMapping?.xAxis || defaultTimeXAxis
              }
              yAxisKeys={visualization.options.columnMapping?.yAxis || []}
              configs={visualization.options}
            />
          );
          break;
        case TYPE_VISUALIZATION.area:
          visualizationDisplay = (
            <AreaChart
              data={data}
              xAxisKey={
                visualization.options?.columnMapping?.xAxis || defaultTimeXAxis
              }
              yAxisKeys={visualization.options.columnMapping?.yAxis || []}
              configs={visualization.options}
            />
          );
          break;
        case TYPE_VISUALIZATION.scatter:
          visualizationDisplay = (
            <ScatterChart
              data={queryResult}
              xAxisKey={
                visualization.options?.columnMapping?.xAxis || defaultTimeXAxis
              }
              yAxisKeys={visualization.options.columnMapping?.yAxis || []}
            />
          );
          break;
        case TYPE_VISUALIZATION.pie:
          visualizationDisplay = (
            <PieChart data={queryResult} dataKey={'number'} />
          );
          break;
        default:
          break;
      }
    }

    return (
      <>
        <div className="visual-container__visualization">
          <div className="visual-container__visualization__title">
            {visualization.name}
          </div>
          {errorMessage ? (
            <Flex
              alignItems={'center'}
              justifyContent={'center'}
              className="visual-container__visualization__error"
            >
              {errorMessage}
            </Flex>
          ) : (
            visualizationDisplay
          )}
        </div>
        {visualizationConfiguration}
      </>
    );
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
        tabs={[
          ...queryValue.visualizations,
          {
            id: TYPE_VISUALIZATION.new,
            createdAt: moment().toDate(),
            options: {},
            name: 'New Visualization',
            type: TYPE_VISUALIZATION.new,
          },
        ].map((v) => ({
          icon: getIcon(v.options.globalSeriesType || v.type),
          name: v.name,
          content: renderVisualization(v),
          id: v.id,
          closeable: v.type !== TYPE_VISUALIZATION.new,
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
