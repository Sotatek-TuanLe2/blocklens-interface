import { Flex, Tooltip } from '@chakra-ui/react';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  PieChart,
  VisualizationChart,
  VisualizationTable,
  VisualizationCounter,
} from 'src/components/Charts';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/TableValue.scss';
import 'src/styles/pages/DashboardDetailPage.scss';
import 'src/styles/components/Chart.scss';
import {
  IErrorExecuteQuery,
  TYPE_VISUALIZATION,
  VisualizationType,
} from 'src/utils/query.type';
import { areYAxisesSameType, getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import { Link } from 'react-router-dom';
import { QUERY_RESULT_STATUS, ROUTES } from 'src/utils/common';
import { ClockIcon } from 'src/assets/icons';

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
    const [queryResult, setQueryResult] = useState<unknown[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorExecuteQuery, setErrorExecuteQuery] =
      useState<IErrorExecuteQuery>();

    const queryId = visualization?.queryId;
    const fetchQueryResultInterval: any = useRef();
    const refetchQueryResultInterval: any = useRef();
    useEffect(() => {
      clearInterval(refetchQueryResultInterval.current);
      if (queryId) {
        fetchInitialData();
        refetchQueryResultInterval.current = setInterval(
          async () => await fetchInitialData(),
          5 * 60 * 1000,
        );
      }

      return () => {
        clearInterval(fetchQueryResultInterval.current);
        clearInterval(refetchQueryResultInterval.current);
      };
    }, [queryId]);

    const fetchQueryResult = async () => {
      setIsLoading(true);
      clearInterval(fetchQueryResultInterval.current);
      const executionId = visualization?.query?.resultId;
      const res = await rf
        .getRequest('DashboardsRequest')
        .getQueryResult({ executionId: visualization?.query?.resultId });
      if (res.status === QUERY_RESULT_STATUS.WAITING) {
        fetchQueryResultInterval.current = setInterval(async () => {
          const resInterval = await rf
            .getRequest('DashboardsRequest')
            .getQueryResult({
              executionId,
            });
          if (resInterval.status !== QUERY_RESULT_STATUS.WAITING) {
            clearInterval(fetchQueryResultInterval.current);
            setQueryResult(resInterval.result);
            if (resInterval?.error) {
              setErrorExecuteQuery(resInterval?.error);
            }
            setIsLoading(false);
          }
        }, 2000);
      } else {
        setQueryResult(res.result);
        setErrorExecuteQuery(res?.error);
        setIsLoading(false);
      }
    };

    const fetchInitialData = async () => {
      try {
        await fetchQueryResult();
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    };

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

    const generateErrorMessage = (
      visualization: VisualizationType,
    ): string | null => {
      const type =
        visualization.options?.globalSeriesType || visualization.type;
      if (
        type === TYPE_VISUALIZATION.table ||
        type === TYPE_VISUALIZATION.counter
      ) {
        return null;
      }

      let errorMessage = null;
      if (!visualization.options?.columnMapping?.xAxis) {
        errorMessage = 'Missing x-axis';
      } else if (!visualization.options?.columnMapping?.yAxis.length) {
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

    const _renderVisualization = (visualization: VisualizationType) => {
      const errorMessage = generateErrorMessage(visualization);

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
              xAxisKey={
                visualization.options?.columnMapping?.xAxis || defaultTimeXAxis
              }
              yAxisKeys={visualization.options.columnMapping?.yAxis || []}
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
              xAxisKey={
                visualization.options?.columnMapping?.xAxis || defaultTimeXAxis
              }
              yAxisKeys={visualization.options.columnMapping?.yAxis || []}
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
                to={`${needAuthentication ? ROUTES.MY_QUERY : ROUTES.QUERY}/${
                  visualization.queryId
                }`}
              >
                {visualization.query?.name}
              </Link>
            </Tooltip>
          </div>
          {_renderContent()}
        </div>
        <div className="box-updated">
          <Tooltip
            bg={'#FFFFFF'}
            color={'#000224'}
            fontWeight="400"
            p={2}
            label={`Updated: ${moment(visualization.query?.updatedAt).format(
              'YYYY/MM/DD HH:MM',
            )}`}
            placement={'top-start'}
            hasArrow
          >
            <ClockIcon />
          </Tooltip>
        </div>
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
