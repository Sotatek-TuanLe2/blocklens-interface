import { Box, Flex, Tooltip } from '@chakra-ui/react';
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
import { AppButton, AppTabs } from '../../../components';
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
  TYPE_VISUALIZATION,
  VALUE_VISUALIZATION,
  VisualizationType,
} from '../../../utils/query.type';
import { objectKeys } from 'src/utils/utils-network';
import { areYAxisesSameType } from 'src/utils/utils-helper';
import { getDefaultVisualizationName } from 'src/utils/common';
import { toastError } from 'src/utils/utils-notify';
import { Query } from 'src/utils/utils-query';

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
  expandEditor: boolean;
  onExpand: (value: React.SetStateAction<boolean>) => void;
};

const VisualizationDisplay = ({
  queryResult,
  queryValue,
  onReload,
  expandEditor,
  onExpand,
}: Props) => {
  interface ParamTypes {
    queryId: string;
  }
  const { queryId } = useParams<ParamTypes>();

  const [closeTabId, setCloseTabId] = useState<string | number>('');
  const [dataTable, setDataTable] = useState<any[]>([]);

  const queryClass = useMemo(() => new Query(queryValue), [queryValue]);

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
    let newVisualization = {};

    if (searchedVisualization.type === TYPE_VISUALIZATION.table) {
      newVisualization = {
        name: 'Table',
        type: 'table',
        options: {},
      };
    } else if (searchedVisualization.type === TYPE_VISUALIZATION.counter) {
      newVisualization = {
        name: 'Counter',
        type: 'counter',
        options: {
          counterColName: !!axisOptions.length ? axisOptions[0] : '',
          rowNumber: 1,
        },
      };
    } else {
      newVisualization = {
        name: searchedVisualization.label,
        type: 'chart',
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
    const visualization = queryClass?.getVisualizationById(
      visualizationId.toString(),
    );
    if (!visualization) return;
    try {
      await rf
        .getRequest('DashboardsRequest')
        .deleteVisualization({ visualId: visualizationId });
      await onReload();
    } catch (error: any) {
      toastError({ message: error.message });
    }
  };

  const onChangeConfigurations = async (visualization: VisualizationType) => {
    const visual = queryClass?.getVisualizationById(visualization.id);
    if (!!visual) {
      await rf
        .getRequest('DashboardsRequest')
        .editVisualization(visualization, visualization.id);
      await onReload();
    }
  };

  const renderVisualization = (visualization: VisualizationType) => {
    const type = visualization.options?.globalSeriesType || visualization.type;

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
      <div
        className={`visual-container__wrapper ${
          expandEditor ? 'visual-container__wrapper--hidden' : ''
        }`}
      >
        <div className="visual-container__visualization">
          {/* <div className="visual-container__visualization__title">
            <Tooltip
              label={visualization.name || getDefaultVisualizationName(type)}
              hasArrow
            >
              {visualization.name || getDefaultVisualizationName(type)}
            </Tooltip>
          </div> */}
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
      </div>
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
        rightElement={
          <Flex gap={'10px'}>
            <Tooltip label={!expandEditor ? 'Minimize' : 'Maximum'} hasArrow>
              <div
                className="btn-expand"
                onClick={() => onExpand((pre) => !pre)}
              >
                {!expandEditor ? (
                  <p className="icon-query-collapse" />
                ) : (
                  <p className="icon-query-expand" />
                )}
              </div>
            </Tooltip>

            <div className="btn-expand">
              <p className="icon-query-edit" />
            </div>
          </Flex>
        }
        onChange={() => onExpand(false)}
        tabs={[
          ...queryValue.visualizations.map((v) => ({
            icon: getIcon(v?.options?.globalSeriesType || v.type),
            name:
              v.name ||
              getDefaultVisualizationName(
                v?.options?.globalSeriesType || v.type,
              ),
            content: renderVisualization(v),
            id: v.id,
            closeable: true,
          })),
          {
            icon: null,
            name: (
              <Tooltip label="Add New Visualization" hasArrow>
                <Flex alignItems={'center'}>
                  <Box className="icon-plus-circle" mr={2} /> Add Chart
                </Flex>
              </Tooltip>
            ),
            content: (
              <AddVisualization
                expandEditor={expandEditor}
                onAddVisualize={addVisualizationHandler}
              />
            ),
            id: TYPE_VISUALIZATION.new,
            closeable: false,
          },
        ]}
      />
      <BaseModal
        title={'Remove visualization'}
        description={
          'Are you sure to remove this visualization? All contents within this visualization will be deleted'
        }
        icon="icon-delete"
        isOpen={closeTabId !== ''}
        onClose={() => setCloseTabId('')}
      >
        <form className="main-modal-dashboard-details">
          <Flex flexWrap={'wrap'} gap={'10px'} className="group-action-query">
            <AppButton
              onClick={() => setCloseTabId('')}
              size="lg"
              variant={'cancel'}
            >
              Cancel
            </AppButton>
            <AppButton
              size="lg"
              onClick={() => {
                setCloseTabId('');
                removeVisualizationHandler(closeTabId);
              }}
            >
              Delete
            </AppButton>
          </Flex>
        </form>
      </BaseModal>
    </Box>
  );
};

export default VisualizationDisplay;

type AddVisualizationProps = {
  onAddVisualize: (visualizationValue: string) => void;
  expandEditor?: boolean;
};

const AddVisualization = ({
  onAddVisualize,
  expandEditor,
}: AddVisualizationProps) => {
  const getIcon = (chain: string | undefined) => {
    switch (chain) {
      case TYPE_VISUALIZATION.table:
        return <p className="icon-table-chart-query" />;

      case TYPE_VISUALIZATION.scatter:
        return <p className="icon-scatter-chart-query" />;

      case TYPE_VISUALIZATION.area:
        return <p className="icon-area-chart-query" />;

      case TYPE_VISUALIZATION.line: {
        return <p className="icon-line-chart-query" />;
      }

      case TYPE_VISUALIZATION.pie:
        return <p className="icon-pie-chart-query" />;

      case TYPE_VISUALIZATION.bar:
        return <p className="icon-bar-chart-query" />;

      case TYPE_VISUALIZATION.counter:
        return <p className="icon-counter-query" />;

      default:
        return <></>;
    }
  };
  return (
    <Box>
      {!expandEditor && (
        <div className="main-item">
          <div className="top-items">
            {visualizationConfigs.slice(0, 3).map((i) => (
              <div
                className="item-visual"
                key={i.value}
                onClick={() => {
                  onAddVisualize(i.value);
                }}
              >
                {getIcon(i.type)}
                {i.label}
              </div>
            ))}
          </div>
          <div className="bottom-items">
            {visualizationConfigs.slice(3).map((i) => (
              <div
                className="item-visual"
                key={i.value}
                onClick={() => {
                  onAddVisualize(i.value);
                }}
              >
                {getIcon(i.type)}
                {i.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </Box>
  );
};
