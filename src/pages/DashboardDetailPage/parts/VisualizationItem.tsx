import { Flex } from '@chakra-ui/react';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { PieChart, VisualizationTable } from 'src/components/Charts';
import VisualizationCounter from 'src/components/Charts/VisualizationCounter';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/TableValue.scss';
import 'src/styles/pages/DashboardDetailPage.scss';

import VisualizationChart from 'src/components/Charts/VisualizationChart';
import 'src/styles/components/Chart.scss';
import {
  QueryResultResponse,
  TYPE_VISUALIZATION,
  VisualizationType,
} from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';

const VisualizationItem = React.memo(
  ({ visualization }: { visualization: VisualizationType }) => {
    const [queryResult, setQueryResult] = useState<unknown[]>([]);

    const queryId = visualization?.query?.id;
    const fetchQueryResultInterval: any = useRef();

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

    const fetchQueryResult = async (executionId: string) => {
      const res = await rf.getRequest('DashboardsRequest').getQueryResult({
        queryId,
        executionId,
      });

      if (res.status !== 'DONE') {
        fetchQueryResultInterval.current = setInterval(async () => {
          const resInterval = await rf
            .getRequest('DashboardsRequest')
            .getQueryResult({
              queryId,
              executionId,
            });
          if (resInterval.status === 'DONE') {
            clearInterval(fetchQueryResultInterval.current);
            setQueryResult(resInterval.result);
          }
        }, 2000);
      } else {
        setQueryResult(res.result);
      }
    };

    const fetchInitialData = async () => {
      try {
        const res: QueryResultResponse = await rf
          .getRequest('DashboardsRequest')
          .getQueryExecutionId({
            queryId,
          });
        await fetchQueryResult(res.resultId);
      } catch (error) {
        getErrorMessage(error);
      }
    };

    useEffect(() => {
      if (queryId) {
        fetchInitialData();
      }
    }, [queryId]);

    const renderVisualization = (visualization: VisualizationType) => {
      const type =
        visualization.options?.globalSeriesType || visualization.type;

      let errorMessage = null;
      let visualizationDisplay = null;

      if (!visualization.options?.columnMapping?.xAxis) {
        errorMessage = 'Missing x-axis';
      } else if (!visualization.options?.columnMapping?.yAxis.length) {
        errorMessage = 'Missing y-axis';
      } else {
        // TODO: check yAxis values have same type
      }

      switch (type) {
        case TYPE_VISUALIZATION.table:
          errorMessage = null;
          visualizationDisplay = (
            <VisualizationTable
              data={queryResult}
              dataColumn={visualization.options.columns}
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
        </>
      );
    };

    return renderVisualization(visualization);
  },
);

export default VisualizationItem;