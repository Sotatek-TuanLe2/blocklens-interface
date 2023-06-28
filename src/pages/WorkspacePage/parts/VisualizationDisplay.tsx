import { Box, Flex, Spinner, Tooltip } from '@chakra-ui/react';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  AddChartIcon,
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
import { getDefaultVisualizationName } from 'src/utils/common';
import { areYAxisesSameType, getErrorMessage } from 'src/utils/utils-helper';
import { objectKeys } from 'src/utils/utils-network';
import { toastError } from 'src/utils/utils-notify';
import { Query } from 'src/utils/utils-query';
import { AppButton, AppTabs, ITabs } from '../../../components';
import {
  PieChart,
  VisualizationChart,
  VisualizationCounter,
  VisualizationTable,
} from '../../../components/Charts';
import ChartConfigurations from '../../../components/VisualizationConfigs/ChartConfigurations';
import TableConfigurations from '../../../components/VisualizationConfigs/TableConfigurations';
import BaseModal from '../../../modals/BaseModal';
import {
  IQuery,
  LAYOUT_QUERY,
  TYPE_VISUALIZATION,
  VALUE_VISUALIZATION,
  VisualizationType,
} from '../../../utils/query.type';

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
  expandLayout: string;
  needAuthentication?: boolean;
  onReload: () => Promise<any>;
  onExpand: (value: React.SetStateAction<string>) => void;
};

const VisualizationDisplay = ({
  queryResult,
  queryValue,
  expandLayout,
  needAuthentication = true,
  onReload,
  onExpand,
}: Props) => {
  interface ParamTypes {
    queryId: string;
  }
  const { queryId } = useParams<ParamTypes>();

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [toggleCloseConfig, setToggleCloseConfig] = useState<boolean>(false);
  const [closeTabId, setCloseTabId] = useState<string | number>('');
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);

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
        type: TYPE_VISUALIZATION.table,
        options: {},
      };
    } else if (searchedVisualization.type === TYPE_VISUALIZATION.counter) {
      newVisualization = {
        name: 'Counter',
        type: TYPE_VISUALIZATION.counter,
        options: {
          counterColName: !!axisOptions.length ? axisOptions[0] : '',
          rowNumber: '1',
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

    setIsConfiguring(true);
    try {
      await rf.getRequest('DashboardsRequest').insertVisualization({
        ...newVisualization,
        queryId: queryId,
      });
      await onReload();
      setIsConfiguring(false);
    } catch (error) {
      setIsConfiguring(false);
      console.error(error);
    }
  };

  const removeVisualizationHandler = async (
    visualizationId: string | number,
  ) => {
    const visualization = queryClass?.getVisualizationById(
      visualizationId.toString(),
    );
    if (!visualization) return;
    setIsConfiguring(true);
    try {
      await rf
        .getRequest('DashboardsRequest')
        .deleteVisualization({ visualId: visualizationId });
      await onReload();
      setIsConfiguring(false);
    } catch (error: any) {
      setIsConfiguring(false);
      toastError({ message: getErrorMessage(error) });
    }
  };

  const onChangeConfigurations = async (visualization: VisualizationType) => {
    const visual = queryClass?.getVisualizationById(visualization.id);
    if (!!visual) {
      setIsConfiguring(true);
      try {
        await rf
          .getRequest('DashboardsRequest')
          .editVisualization(visualization, visualization.id);
        await onReload();
        setIsConfiguring(false);
      } catch (error) {
        setIsConfiguring(false);
        console.error(error);
      }
    }
  };

  const _renderConfigurations = (visualization: VisualizationType) => {
    if (!toggleCloseConfig) {
      return null;
    }

    const type = visualization.options?.globalSeriesType || visualization.type;
    let configuration = null;

    switch (type) {
      case TYPE_VISUALIZATION.table:
        configuration = (
          <TableConfigurations
            data={queryResult}
            visualization={visualization}
            onChangeConfigurations={onChangeConfigurations}
            dataTable={dataTable}
          />
        );
        break;
      case TYPE_VISUALIZATION.counter:
        configuration = (
          <CounterConfiguration
            data={queryResult}
            visualization={visualization}
            onChangeConfigurations={onChangeConfigurations}
          />
        );
        break;
      case TYPE_VISUALIZATION.pie:
        configuration = (
          <ChartConfigurations
            data={queryResult}
            visualization={visualization}
            onChangeConfigurations={onChangeConfigurations}
          />
        );
        break;
      default:
        configuration = (
          <ChartConfigurations
            data={queryResult}
            visualization={visualization}
            onChangeConfigurations={onChangeConfigurations}
          />
        );
    }

    const typeNameVisual = (type: string) => {
      switch (type) {
        case TYPE_VISUALIZATION.table:
          return 'table';
        case TYPE_VISUALIZATION.counter:
          return 'counter';
        default:
          return 'chart';
      }
    };

    return (
      <div
        className={`main-config ${
          toggleCloseConfig ? 'show-config' : 'hidden-config'
        }`}
      >
        <div className="header-config">
          <div className="title-config">{typeNameVisual(type)} Options</div>
          <p
            className="close-config-icon"
            onClick={() => setToggleCloseConfig(false)}
          />
        </div>
        <div
          className={`body-config ${
            expandLayout === LAYOUT_QUERY.HIDDEN ? 'body-config--expand' : ''
          }`}
        >
          {configuration}
        </div>
      </div>
    );
  };

  const generateErrorMessage = (
    visualization: VisualizationType,
  ): string | null => {
    const type = visualization.options?.globalSeriesType || visualization.type;
    if (
      type === TYPE_VISUALIZATION.table ||
      type === TYPE_VISUALIZATION.counter
    ) {
      return null;
    }

    let errorMessage = null;
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

    return errorMessage;
  };

  const _renderVisualization = (
    visualization: VisualizationType,
    showConfiguration = true,
  ) => {
    const type = visualization.options?.globalSeriesType || visualization.type;
    let visualizationDisplay = null;

    switch (type) {
      case TYPE_VISUALIZATION.table:
        visualizationDisplay = (
          <VisualizationTable
            data={queryResult}
            setDataTable={setDataTable}
            visualization={visualization}
          />
        );
        break;
      case TYPE_VISUALIZATION.counter:
        visualizationDisplay = (
          <VisualizationCounter
            data={queryResult}
            visualization={visualization}
          />
        );
        break;
      case TYPE_VISUALIZATION.pie:
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

    const errorMessage = generateErrorMessage(visualization);

    return (
      <div
        className={`visual-container__wrapper ${
          expandLayout === LAYOUT_QUERY.FULL
            ? 'visual-container__wrapper--hidden'
            : ''
        } ${expandLayout === LAYOUT_QUERY.HIDDEN ? 'hidden-editor' : ''}`}
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
          {isConfiguring && (
            <div className="visual-container__visualization__loading">
              <Spinner size={'sm'} />
            </div>
          )}
          <div className="main-chart">
            <div
              className={`main-visualization ${
                type === TYPE_VISUALIZATION.table
                  ? 'main-visualization--table'
                  : ''
              } ${
                expandLayout === LAYOUT_QUERY.HIDDEN
                  ? 'main-visualization--expand'
                  : ''
              } ${!toggleCloseConfig ? 'show-full-visual' : ''}`}
            >
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
            {showConfiguration && _renderConfigurations(visualization)}
          </div>
        </div>
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
        return <QueryResultIcon />;
    }
  };

  const onChangeTab = (_tabId: string, tabIndex: number) => {
    setTabIndex(tabIndex);
    setToggleCloseConfig(needAuthentication && !!tabIndex);
    onExpand(LAYOUT_QUERY.HIDDEN);
  };

  const generateTabs = () => {
    const resultTableTab: VisualizationType = {
      id: `${queryValue.id}-result-table`,
      name: 'Result Table',
      type: TYPE_VISUALIZATION.table,
      createdAt: '',
      updatedAt: '',
      options: {},
    };

    const tabs: ITabs[] = [
      {
        icon: getIcon(resultTableTab.type),
        name: resultTableTab.name,
        content: _renderVisualization(resultTableTab, false),
        id: resultTableTab.id,
        closeable: false,
      },
      ...queryValue.visualizations.map((v) => ({
        icon: getIcon(v?.options?.globalSeriesType || v.type),
        name:
          v.name ||
          getDefaultVisualizationName(v?.options?.globalSeriesType || v.type),
        content: _renderVisualization(v, needAuthentication),
        id: v.id,
        closeable: needAuthentication,
      })),
    ];

    if (needAuthentication) {
      tabs.push({
        name: (
          <Tooltip
            label="Add New Visualization"
            hasArrow
            bg="white"
            color="black"
          >
            <Flex alignItems={'center'}>
              <Box>
                <AddChartIcon />
              </Box>{' '}
              Add Chart
            </Flex>
          </Tooltip>
        ),
        content: (
          <AddVisualization
            expandLayout={expandLayout}
            isConfiguring={isConfiguring}
            onAddVisualize={addVisualizationHandler}
          />
        ),
        id: TYPE_VISUALIZATION.new,
        closeable: false,
      });
    }

    return tabs;
  };

  const tabs = generateTabs();

  return (
    <Box className="visual-container">
      <AppTabs
        currentTabIndex={tabIndex}
        onCloseTab={(tabId: string) => {
          setCloseTabId(tabId);
        }}
        rightElement={
          <Flex gap={'10px'}>
            <Tooltip
              label={expandLayout === LAYOUT_QUERY.FULL ? 'Expand' : 'Minimize'}
              hasArrow
              bg="white"
              color="black"
            >
              <div className="btn-expand">
                {expandLayout === LAYOUT_QUERY.FULL ? (
                  <p
                    className="icon-query-expand"
                    onClick={() => onExpand(LAYOUT_QUERY.HIDDEN)}
                  />
                ) : (
                  <p
                    className="icon-query-collapse"
                    onClick={() => onExpand(LAYOUT_QUERY.FULL)}
                  />
                )}
              </div>
            </Tooltip>
            {needAuthentication && tabIndex > 0 && tabIndex < tabs.length - 1 && (
              <Tooltip label="Edit" hasArrow bg="white" color="black">
                <div
                  className="btn-expand"
                  onClick={() => {
                    setToggleCloseConfig((pre) => !pre);
                  }}
                >
                  <p className="icon-query-edit" />
                </div>
              </Tooltip>
            )}
          </Flex>
        }
        onChange={onChangeTab}
        tabs={tabs}
      />
      <BaseModal
        title={'Remove Visualization'}
        description={'All contents within this widget will be removed.'}
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
              className="btn-cancel"
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
              Remove
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
  expandLayout?: string;
  isConfiguring: boolean;
};

const AddVisualization = ({
  onAddVisualize,
  expandLayout,
  isConfiguring,
}: AddVisualizationProps) => {
  const getIcon = (chain: string | undefined) => {
    if (!chain) {
      return null;
    }
    return <p className={`icon-${chain}-chart-query`} />;
  };

  return (
    <Box>
      {expandLayout === LAYOUT_QUERY.HIDDEN && (
        <div
          className={`main-item ${
            expandLayout === LAYOUT_QUERY.HIDDEN ? 'main-item-expand' : ''
          }`}
        >
          {isConfiguring && (
            <div className="visual-container__visualization__loading">
              <Spinner size={'sm'} />
            </div>
          )}
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
