import { Box, Flex, Spinner, Tooltip } from '@chakra-ui/react';
import moment from 'moment';
import { useMemo, useRef, useState } from 'react';
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
import { toastError, toastSuccess } from 'src/utils/utils-notify';
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
import _ from 'lodash';
import { isMobile } from 'react-device-detect';

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

export const getDefaultTimeAxis = (data: any[]): string => {
  let result = '';
  const firstResultInQuery: any = data && !!data.length ? data[0] : null;
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
};

export const generateErrorMessage = (
  visualization: VisualizationType,
  data: any[],
): string | null => {
  const { options } = visualization;
  const type = options.globalSeriesType || visualization.type;
  const xAxis = options.columnMapping?.xAxis;
  const yAxis = options.columnMapping?.yAxis;
  const axisOptions = Array.isArray(data) && data[0] ? objectKeys(data[0]) : [];

  if (
    type === TYPE_VISUALIZATION.table ||
    type === TYPE_VISUALIZATION.counter
  ) {
    return null;
  }

  let errorMessage = null;
  if (!xAxis || !axisOptions.includes(xAxis)) {
    errorMessage = 'Missing x-axis';
  } else if (!yAxis.length || !_.intersection(yAxis, axisOptions).length) {
    errorMessage = 'Missing y-axis';
  } else if (!areYAxisesSameType(data, yAxis)) {
    errorMessage = 'All columns for a y-axis must have the same data type';
  }

  return errorMessage;
};

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
  const [closeTabIndex, setCloseTabIndex] = useState<string | number>('');
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);

  const queryClass = useMemo(() => new Query(queryValue), [queryValue]);

  const axisOptions =
    Array.isArray(queryResult) && queryResult[0]
      ? objectKeys(queryResult[0])
      : [];

  const defaultTimeXAxis = useMemo(
    () => getDefaultTimeAxis(queryResult),
    [queryResult],
  );

  const getNewVisualization = (type: string, name: string) => {
    switch (type) {
      case TYPE_VISUALIZATION.table:
        return {
          name: 'Table',
          type: TYPE_VISUALIZATION.table,
          options: {},
        };
      case TYPE_VISUALIZATION.counter:
        return {
          name: 'Counter',
          type: TYPE_VISUALIZATION.counter,
          options: {
            counterColName: !!axisOptions.length ? axisOptions[0] : '',
            rowNumber: '1',
          },
        };
      default:
        return {
          name,
          type: 'chart',
          options: {
            globalSeriesType: type,
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
  };

  const addVisualizationHandler = async (visualizationType: string) => {
    const searchedVisualization = visualizationConfigs.find(
      (v) => v.value === visualizationType,
    );
    if (!searchedVisualization) return;

    const newVisualization = getNewVisualization(
      searchedVisualization.type,
      searchedVisualization.label,
    );
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
      toastError({ message: getErrorMessage(error) });
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
      toastSuccess({ message: 'Delete visualization successfully!' });
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
        toastError({ message: getErrorMessage(error) });
      }
    }
  };

  const _renderConfigurations = (visualization: VisualizationType) => {
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

    const ConfigOnDesktop = (
      <div className={`main-config`}>
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

    const ConfigOnMobile = (
      <BaseModal
        isOpen={toggleCloseConfig}
        onClose={() => setToggleCloseConfig(false)}
        isCentered={false}
        title={
          <Box textTransform={'capitalize'}>{`${typeNameVisual(
            type,
          )} Options`}</Box>
        }
      >
        <div className={'main-config'}>
          <div className={'body-config'}>{configuration}</div>
        </div>
      </BaseModal>
    );

    return !isMobile ? ConfigOnDesktop : ConfigOnMobile;
  };

  const _renderVisualization = (
    visualization: VisualizationType,
    showConfiguration = true,
  ) => {
    const type = visualization.options?.globalSeriesType || visualization.type;
    let visualizationDisplay = null;
    const xAxisKey =
      visualization.options?.columnMapping?.xAxis || defaultTimeXAxis;
    const yAxisKeys = visualization.options.columnMapping?.yAxis || [];

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
            xAxisKey={xAxisKey}
            yAxisKeys={yAxisKeys}
            configs={visualization.options}
          />
        );
        break;
      default:
        visualizationDisplay = (
          <VisualizationChart
            data={queryResult}
            xAxisKey={xAxisKey}
            yAxisKeys={yAxisKeys}
            configs={visualization.options}
            type={type}
          />
        );
    }

    const errorMessage = generateErrorMessage(visualization, queryResult);

    return (
      <div
        className={`visual-container__wrapper ${
          expandLayout === LAYOUT_QUERY.FULL
            ? 'visual-container__wrapper--hidden'
            : ''
        } ${expandLayout === LAYOUT_QUERY.HIDDEN ? 'hidden-editor' : ''}`}
      >
        <div className="visual-container__visualization">
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
              } ${!toggleCloseConfig || isMobile ? 'show-full-visual' : ''}`}
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
      case TYPE_VISUALIZATION.scatter:
        return <ScatterChartIcon />;
      case TYPE_VISUALIZATION.area:
        return <AreaChartIcon />;
      case TYPE_VISUALIZATION.line:
        return <LineChartIcon />;
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

  const firstSelectTab = useRef<boolean>(false);

  const onChangeTab = (_tabId: string, tabIndex: number) => {
    setTabIndex(tabIndex);
    if ((isMobile && !firstSelectTab.current) || !isMobile) {
      setToggleCloseConfig(needAuthentication && !!tabIndex);
    }
    onExpand(LAYOUT_QUERY.HIDDEN);
    firstSelectTab.current = true;
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
              {!isMobile && 'Add Chart'}
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
  const showEditButton =
    needAuthentication && tabIndex > 0 && tabIndex < tabs.length - 1;

  return (
    <Box className="visual-container">
      <AppTabs
        currentTabIndex={tabIndex}
        onCloseTab={(tabId: string) => {
          setCloseTabIndex(tabId);
        }}
        rightElement={
          <Flex gap={'10px'}>
            <div className="btn-expand">
              <p
                className={
                  expandLayout === LAYOUT_QUERY.FULL
                    ? 'icon-query-expand'
                    : 'icon-query-collapse'
                }
                onClick={() =>
                  onExpand(
                    expandLayout === LAYOUT_QUERY.FULL
                      ? LAYOUT_QUERY.HIDDEN
                      : LAYOUT_QUERY.FULL,
                  )
                }
              />
            </div>
            {showEditButton && (
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
        isOpen={!!closeTabIndex}
        onClose={() => setCloseTabIndex('')}
      >
        <form className="main-modal-dashboard-details">
          <Flex flexWrap={'wrap'} gap={'10px'} className="group-action-query">
            <AppButton
              onClick={() => setCloseTabIndex('')}
              size="lg"
              variant={'cancel'}
              className="btn-cancel"
              maxW={'48%'}
            >
              Cancel
            </AppButton>
            <AppButton
              size="lg"
              maxW={'48%'}
              onClick={() => {
                setCloseTabIndex('');
                removeVisualizationHandler(closeTabIndex);
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
  onAddVisualize: (visualizationType: string) => void;
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
