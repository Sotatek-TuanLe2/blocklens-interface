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
import { objectKeys } from 'src/utils/utils-network';
import VisualizationCounter from 'src/components/Charts/VisualizationCounter';
import CounterConfiguration from 'src/components/VisualizationConfigs/CounterConfiguration';

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

    const columns = axisOptions.map(
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
    if (searchedVisualization.type === TYPE_VISUALIZATION.table) {
      newVisualization = {
        name: 'Query results',
        id: (Math.floor(Math.random() * 100) + 1).toString(),
        type: 'table',
        createdAt: moment().toDate(),
        options: { columns },
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
    const data = visualization.options.xAxisConfigs?.sortX
      ? queryResult.sort(
          (a: any, b: any) =>
            a[visualization.options.columnMapping.xAxis] -
            b[visualization.options.columnMapping.xAxis],
        )
      : queryResult;

    switch (type) {
      case TYPE_VISUALIZATION.table:
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {visualization.name}
              </div>
              <VisualizationTable
                data={queryResult}
                setDataTable={setDataTable}
                dataColumn={visualization.options.columns}
              />
            </div>
            <TableConfigurations
              visualization={visualization}
              onChangeConfigurations={onChangeConfigurations}
              dataTable={dataTable}
            />
          </>
        );
      case TYPE_VISUALIZATION.counter:
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {visualization.name}
              </div>
              <VisualizationCounter />
            </div>
            <CounterConfiguration
              visualization={visualization}
              onChangeConfigurations={onChangeConfigurations}
            />
          </>
        );
      case TYPE_VISUALIZATION.line: {
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {visualization.name}
              </div>
              <LineChart
                data={data}
                xAxisKey={visualization.options?.columnMapping?.xAxis || 'time'}
                yAxisKeys={
                  visualization.options.columnMapping?.yAxis || ['size']
                }
                configs={visualization.options}
              />
            </div>
            <ChartConfigurations
              data={queryResult}
              visualization={visualization}
              onChangeConfigurations={onChangeConfigurations}
            />
          </>
        );
      }
      case TYPE_VISUALIZATION.bar:
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {visualization.name}
              </div>
              <BarChart
                data={data}
                xAxisKey={visualization.options?.columnMapping?.xAxis || 'time'}
                yAxisKeys={
                  visualization.options.columnMapping?.yAxis || ['size']
                }
                configs={visualization.options}
              />
            </div>
            <ChartConfigurations
              data={queryResult}
              visualization={visualization}
              onChangeConfigurations={onChangeConfigurations}
            />
          </>
        );
      case TYPE_VISUALIZATION.area:
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {visualization.name}
              </div>
              <AreaChart
                data={data}
                xAxisKey={visualization.options?.columnMapping?.xAxis || 'time'}
                yAxisKeys={
                  visualization.options.columnMapping?.yAxis || ['size']
                }
                configs={visualization.options}
              />
            </div>
            <ChartConfigurations
              data={queryResult}
              visualization={visualization}
              onChangeConfigurations={onChangeConfigurations}
            />
          </>
        );
      case TYPE_VISUALIZATION.pie:
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {visualization.name}
              </div>
              <PieChart data={queryResult} dataKey={'number'} />;
            </div>
            <ChartConfigurations
              data={queryResult}
              visualization={visualization}
              onChangeConfigurations={onChangeConfigurations}
            />
          </>
        );
      case TYPE_VISUALIZATION.scatter: {
        return (
          <>
            <div className="visual-container__visualization">
              <div className="visual-container__visualization__title">
                {visualization.name}
              </div>
              <ScatterChart
                data={queryResult}
                xAxisKey={'number'}
                yAxisKeys={['size']}
              />
            </div>
            <ChartConfigurations
              data={queryResult}
              visualization={visualization}
              onChangeConfigurations={onChangeConfigurations}
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
        tabs={[
          ...queryValue.visualizations,
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
