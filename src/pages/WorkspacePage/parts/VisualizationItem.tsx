import { Flex, Spinner, Tooltip } from '@chakra-ui/react';
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
  QueryExecutedResponse,
  TYPE_VISUALIZATION,
  VisualizationType,
} from 'src/utils/query.type';
import { areYAxisesSameType, getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import { Link } from 'react-router-dom';
import { QUERY_RESULT_STATUS, ROUTES } from 'src/utils/common';
import useUser from 'src/hooks/useUser';

const VisualizationItem = React.memo(
  ({
    visualization,
    needAuthentication = true,
  }: {
    visualization: VisualizationType;
    needAuthentication?: boolean;
  }) => {
    const { user } = useUser();

    const [queryResult, setQueryResult] = useState<unknown[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorExecuteQuery, setErrorExecuteQuery] =
      useState<IErrorExecuteQuery>();

    const queryId = visualization?.queryId;
    const query = visualization.query?.query;
    const fetchQueryResultInterval: any = useRef();

    useEffect(() => {
      if (queryId) {
        fetchInitialData();
      }
    }, [queryId]);

    const fetchQueryResult = async () => {
      setIsLoading(true);
      const executedResponse: QueryExecutedResponse = user
        ? await rf
            .getRequest('DashboardsRequest')
            .getTemporaryQueryResult(query)
        : await rf.getRequest('DashboardsRequest').executePublicQuery(queryId);
      const executionId = executedResponse.id;

      const res = await rf
        .getRequest('DashboardsRequest')
        .getQueryResult({ executionId });

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

    const renderVisualization = (visualization: VisualizationType) => {
      const type =
        visualization.options?.globalSeriesType || visualization.type;

      let errorMessage = null;
      let visualizationDisplay = null;

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

      switch (type) {
        case TYPE_VISUALIZATION.table:
          errorMessage = null;
          visualizationDisplay = (
            <VisualizationTable
              data={queryResult}
              visualization={visualization}
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
            />
          );
      }

      return (
        <div className="visual-container__visualization">
          <div className="visual-container__visualization__title">
            <Tooltip label={visualization.name} hasArrow>
              <span className="visual-container__visualization__name">
                {visualization.name}
              </span>
            </Tooltip>
            <Tooltip label={visualization.query?.name} hasArrow>
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
          {errorMessage ? (
            <Flex
              alignItems={'center'}
              justifyContent={'center'}
              className="visual-container__visualization__error"
            >
              {errorMessage}
            </Flex>
          ) : (
            <div
              className={`${
                type === TYPE_VISUALIZATION.table
                  ? 'table-content'
                  : 'chart-content'
              }`}
            >
              {visualizationDisplay}
            </div>
          )}
        </div>
      );
    };

    return isLoading ? (
      <div className="visual-container__visualization visual-container__visualization--loading">
        <Spinner />
      </div>
    ) : !!queryResult.length ? (
      renderVisualization(visualization)
    ) : (
      <NoDataItem errorMessage={errorExecuteQuery?.message} />
    );
  },
);

const NoDataItem: React.FC<{ errorMessage?: string }> = (props) => {
  return (
    <Flex w={'full'} h={'full'} justifyContent={'center'} alignItems="center">
      {props.errorMessage || 'No data...'}
    </Flex>
  );
};

export default VisualizationItem;
