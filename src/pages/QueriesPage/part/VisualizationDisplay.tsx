import { Box, Flex, Text } from '@chakra-ui/react';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import 'src/styles/components/Chart.scss';
import {
  PieChart,
  VisualizationChart,
  VisualizationTable,
  VisualizationCounter,
} from '../../../components/Charts';
import { AppTabs, AppButton, AppSelect2 } from '../../../components';
import ChartConfigurations from '../../../components/VisualizationConfigs/ChartConfigurations';
import BaseModal from '../../../modals/BaseModal';
import {
  AreaChartIcon,
  BarChartIcon,
  CounterIcon,
  LineChartIcon,
  PieChartIcon,
  QueryResultIcon,
  ScatterChartIcon,
} from 'src/assets/icons';
import CounterConfiguration from 'src/components/VisualizationConfigs/CounterConfiguration';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/Chart.scss';
import TableConfigurations from '../../../components/VisualizationConfigs/TableConfigurations';
import {
  IQuery,
  LABEL_VISUALIZATION,
  TYPE_VISUALIZATION,
  VALUE_VISUALIZATION,
  VisualizationType,
} from '../../../utils/query.type';
import { objectKeys } from 'src/utils/utils-network';
import { areYAxisesSameType } from 'src/utils/utils-helper';
import { getDefaultVisualizationName } from 'src/utils/common';

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
  {
    label: 'Table',
    type: TYPE_VISUALIZATION.table,
    value: VALUE_VISUALIZATION.table,
  },
];

export const VISUALIZATION_DEBOUNCE = 500;

type Props = {
  queryResult: unknown[];
  queryValue: IQuery;
  onReload: () => Promise<void>;
};

const VisualizationDisplay = ({ queryResult, queryValue, onReload }: Props) => {
  interface ParamTypes {
    queryId: string;
  }
  const { queryId } = useParams<ParamTypes>();

  const [closeTabId, setCloseTabId] = useState<string | number>('');
  const [dataTable, setDataTable] = useState<any[]>([]);

  const axisOptions =
    Array.isArray(queryResult) && queryResult[0]
      ? objectKeys(queryResult[0])
      : [];

  const defaultTimeXAxis = useMemo(() => {
    let result = '';
    const firstResultInQuery: any =
      queryResult && !!queryResult.length ? queryResult[0] : null;
    if (firstResultInQuery) {
      Object.keys(firstResultInQuery).forEach((key: string) => {
        const date = moment(firstResultInQuery[key]);
        if (date.isValid() && isNaN(+firstResultInQuery[key])) {
          result = key;
          return;
        }
      });
    }
    return result;
  }, [queryResult]);

  const addVisualizationHandler = async (visualizationValue: string) => {
    const searchedVisualization = visualizationConfigs.find(
      (v) => v.value === visualizationValue,
    );
    if (!searchedVisualization) return;
    let newVisualization: VisualizationType = {} as VisualizationType;

    if (searchedVisualization.type === TYPE_VISUALIZATION.table) {
      newVisualization = {
        name: 'Table',
        id: (Math.floor(Math.random() * 100) + 1).toString(),
        type: 'table',
        createdAt: moment().toDate(),
        options: {},
      };
    } else if (searchedVisualization.type === TYPE_VISUALIZATION.counter) {
      newVisualization = {
        name: 'Counter',
        id: (Math.floor(Math.random() * 100) + 1).toString(),
        type: 'counter',
        createdAt: moment().toDate(),
        options: {
          counterColName: !!axisOptions.length ? axisOptions[0] : '',
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

    await rf.getRequest('DashboardsRequest').insertVisualization({
      ...newVisualization,
      queryId: queryId,
    });
    await onReload();
  };

  const removeVisualizationHandler = async (
    visualizationId: string | number,
  ) => {
    const visualizationIndex = queryValue.visualizations.findIndex(
      (v) => v.id.toString() === visualizationId.toString(),
    );
    if (visualizationIndex === -1) return;

    await rf
      .getRequest('DashboardsRequest')
      .deleteVisualization({ visualId: visualizationId });
    await onReload();
  };

  const onChangeConfigurations = async (visualization: VisualizationType) => {
    const index = queryValue.visualizations.findIndex(
      (v) => v.id === visualization.id,
    );
    if (index >= 0) {
      await rf
        .getRequest('DashboardsRequest')
        .editVisualization(visualization, visualization.id);
      await onReload();
    }
  };

  const renderVisualization = (visualization: VisualizationType) => {
    const type = visualization.options?.globalSeriesType || visualization.type;

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
    } else if (
      !areYAxisesSameType(
        queryResult,
        visualization.options.columnMapping?.yAxis,
      )
    ) {
      errorMessage = 'All columns for a y-axis must have the same data type';
    }
    switch (type) {
      case TYPE_VISUALIZATION.table:
        errorMessage = null;
        visualizationDisplay = (
          <VisualizationTable
            data={queryResult}
            setDataTable={setDataTable}
            visualization={visualization}
          />
        );
        visualizationConfiguration = (
          <TableConfigurations
            data={queryResult}
            visualization={visualization}
            onChangeConfigurations={onChangeConfigurations}
            dataTable={dataTable}
          />
        );

        break;
      case TYPE_VISUALIZATION.counter:
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
        break;
      case TYPE_VISUALIZATION.pie:
        visualizationConfiguration = (
          <ChartConfigurations
            data={queryResult}
            visualization={visualization}
            onChangeConfigurations={onChangeConfigurations}
          />
        );
        visualizationDisplay = (
          <PieChart
            data={queryResult}
            xAxisKey={
              visualization.options?.columnMapping?.xAxis || defaultTimeXAxis
            }
            yAxisKeys={visualization.options.columnMapping?.yAxis || []}
            configs={visualization.options}
          />
        );
        break;
      default:
        // chart
        visualizationConfiguration = (
          <ChartConfigurations
            data={queryResult}
            visualization={visualization}
            onChangeConfigurations={onChangeConfigurations}
          />
        );
        visualizationDisplay = (
          <VisualizationChart
            data={queryResult}
            xAxisKey={
              visualization.options?.columnMapping?.xAxis || defaultTimeXAxis
            }
            yAxisKeys={visualization.options.columnMapping?.yAxis || []}
            configs={visualization.options}
            type={type}
          />
        );
    }

    return (
      <>
        <div className="visual-container__visualization">
          <div className="visual-container__visualization__title">
            {visualization.name || getDefaultVisualizationName(type)}
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

      case TYPE_VISUALIZATION.counter:
        return <CounterIcon />;

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
          icon: getIcon(v?.options?.globalSeriesType || v.type),
          name:
            v.name ||
            getDefaultVisualizationName(v?.options?.globalSeriesType || v.type),
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
