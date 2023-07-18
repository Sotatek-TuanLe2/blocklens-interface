import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { isMobile } from 'react-device-detect';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Link } from 'react-router-dom';
import { ClockIcon } from 'src/assets/icons';
import {
  PieChart,
  VisualizationChart,
  VisualizationCounter,
  VisualizationTable,
} from 'src/components/Charts';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/Chart.scss';
import 'src/styles/components/TableValue.scss';
import 'src/styles/pages/DashboardDetailPage.scss';
import { QUERY_RESULT_STATUS, ROUTES } from 'src/utils/common';
import {
  IErrorExecuteQuery,
  TYPE_VISUALIZATION,
  VisualizationType,
} from 'src/utils/query.type';
import useUser from 'src/hooks/useUser';
import {
  generateErrorMessage,
  getDefaultTimeAxis,
} from './VisualizationDisplay';

const REFETCH_QUERY_RESULT_MINUTES = 5;

const VisualizationItem = React.memo(
  ({
    visualization,
    needAuthentication = true,
    editMode = false,
  }: {
    visualization: VisualizationType;
    needAuthentication?: boolean;
    editMode?: boolean;
  }) => {
    const { user } = useUser();

    const [queryResult, setQueryResult] = useState<unknown[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorExecuteQuery, setErrorExecuteQuery] =
      useState<IErrorExecuteQuery>();
    const [showUpdated, setShowUpdated] = useState<boolean>(false);

    const fetchQueryResultTimeout = useRef<ReturnType<typeof setTimeout>>();
    const refetchQueryResultInterval = useRef<ReturnType<typeof setInterval>>();
    const queryId = visualization?.queryId;

    useEffect(() => {
      clearInterval(refetchQueryResultInterval.current);
      if (queryId) {
        fetchInitialData();
        refetchQueryResultInterval.current = setInterval(
          async () => await fetchInitialData(),
          REFETCH_QUERY_RESULT_MINUTES * 60 * 1000,
        );
      }

      return () => {
        clearTimeout(fetchQueryResultTimeout.current);
        clearInterval(refetchQueryResultInterval.current);
      };
    }, [queryId]);

    const fetchQueryResult = async () => {
      setIsLoading(true);
      clearTimeout(fetchQueryResultTimeout.current);
      const executionId = visualization?.query?.executedId;
      const res = await rf
        .getRequest('DashboardsRequest')
        .getQueryResult({ executionId });
      if (res.status === QUERY_RESULT_STATUS.WAITING) {
        fetchQueryResultTimeout.current = setTimeout(fetchQueryResult, 2000);
      } else {
        setQueryResult(res.result);
        setErrorExecuteQuery(res?.error || null);
        setIsLoading(false);
      }
    };

    const fetchInitialData = async () => {
      try {
        await fetchQueryResult();
      } catch (error) {
        console.error(error);
      }
    };

    const defaultTimeXAxis = useMemo(
      () => getDefaultTimeAxis(queryResult),
      [queryResult],
    );

    const _renderVisualization = (visualization: VisualizationType) => {
      const errorMessage = generateErrorMessage(visualization, queryResult);

      if (!isLoading && errorMessage) {
        return (
          <Flex
            alignItems={'center'}
            justifyContent={'center'}
            className="visual-container__visualization visual-container__visualization--error"
          >
            {errorMessage}
          </Flex>
        );
      }

      const type =
        visualization.options?.globalSeriesType || visualization.type;
      let visualizationDisplay = null;
      const xAxisKey =
        visualization.options?.columnMapping?.xAxis || defaultTimeXAxis;
      const yAxisKeys = visualization.options.columnMapping?.yAxis || [];

      switch (type) {
        case TYPE_VISUALIZATION.table:
          visualizationDisplay = (
            <VisualizationTable
              data={queryResult}
              visualization={visualization}
              editMode={editMode}
              isLoading={isLoading}
            />
          );
          break;
        case TYPE_VISUALIZATION.counter:
          visualizationDisplay = (
            <VisualizationCounter
              data={queryResult}
              visualization={visualization}
              isLoading={isLoading}
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
              isLoading={isLoading}
            />
          );
          break;
        default:
          // chart
          visualizationDisplay = (
            <VisualizationChart
              data={queryResult}
              xAxisKey={xAxisKey}
              yAxisKeys={yAxisKeys}
              configs={visualization.options}
              type={type}
              isLoading={isLoading}
            />
          );
      }

      return (
        <div
          className={`${
            type === TYPE_VISUALIZATION.table
              ? 'table-content'
              : 'chart-content'
          }`}
        >
          {visualizationDisplay}
        </div>
      );
    };

    const _renderContent = () => {
      if (!!queryResult.length || isLoading) {
        return _renderVisualization(visualization);
      }

      return <NoDataItem errorMessage={errorExecuteQuery?.message} />;
    };

    return (
      <>
        <div className="visual-container__visualization">
          <div className="visual-container__visualization__title">
            <Tooltip
              label={visualization.name}
              hasArrow
              bg="white"
              color="black"
            >
              <span className="visual-container__visualization__name">
                {visualization.name}
              </span>
            </Tooltip>
            <Tooltip
              label={visualization.query?.name}
              hasArrow
              bg="white"
              color="black"
            >
              <Link
                className="visual-container__visualization__title__query-link"
                to={`${
                  needAuthentication ||
                  visualization.query?.user === user?.getId()
                    ? ROUTES.MY_QUERY
                    : ROUTES.QUERY
                }/${visualization.queryId}`}
              >
                {visualization.query?.name}
              </Link>
            </Tooltip>
          </div>
          {_renderContent()}
        </div>
        <Box
          className="box-updated"
          onClick={() => setShowUpdated(true)}
          onMouseOut={() => setShowUpdated(false)}
        >
          <Tooltip
            bg={'#FFFFFF'}
            color={'#000224'}
            fontWeight="400"
            p={2}
            label={`Updated: ${moment(visualization.query?.updatedAt).format(
              'YYYY/MM/DD HH:mm',
            )}`}
            placement={'top-start'}
            hasArrow
            isOpen={isMobile ? showUpdated : undefined}
          >
            <ClockIcon />
          </Tooltip>
        </Box>
      </>
    );
  },
);

const NoDataItem: React.FC<{ errorMessage?: string }> = (props) => {
  return (
    <Flex
      className="visual-container__visualization visual-container__visualization--empty"
      justifyContent={'center'}
      alignItems="center"
    >
      {props.errorMessage || 'No data...'}
    </Flex>
  );
};

export default VisualizationItem;
