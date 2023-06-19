import { Box, Flex, Tooltip } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import { AppLoadingTable } from 'src/components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import VisualizationDisplay from 'src/pages/WorkspacePage/parts/VisualizationDisplay';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import { getErrorMessage } from 'src/utils/utils-helper';
import { useParams } from 'react-router-dom';
import {
  QueryExecutedResponse,
  IQuery,
  IErrorExecuteQuery,
  LAYOUT_QUERY,
} from 'src/utils/query.type';
import 'src/styles/pages/QueriesPage.scss';
import { toastError } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import { QUERY_RESULT_STATUS } from 'src/utils/common';
import Header from 'src/pages/WorkspacePage/parts/Header';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { Query } from 'src/utils/utils-query';
import { AddChartIcon, QueryResultIcon } from 'src/assets/icons';

const QueryPart: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();
  const editorRef = useRef<any>();

  const [queryResult, setQueryResult] = useState<any>([]);
  const [queryValue, setQueryValue] = useState<IQuery | null>(null);
  const [expandLayout, setExpandLayout] = useState<string>(LAYOUT_QUERY.HIDDEN);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
  const [errorExecuteQuery, setErrorExecuteQuery] =
    useState<IErrorExecuteQuery>();

  const fetchQueryResultInterval = useRef<any>(null);

  const queryClass = useMemo(() => {
    if (!queryValue) {
      return null;
    }
    return new Query(queryValue);
  }, [queryValue]);

  useEffect(() => {
    if (queryId) {
      fetchInitalData();
      setExpandLayout(LAYOUT_QUERY.HIDDEN);
    }

    return () => {
      if (fetchQueryResultInterval.current) {
        clearInterval(fetchQueryResultInterval.current);
      }
    };
  }, [queryId]);

  const getExecutionResultById = async (executionId: string) => {
    clearInterval(fetchQueryResultInterval.current);
    const res = await rf.getRequest('DashboardsRequest').getQueryResult({
      executionId,
    });
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
          setIsLoadingResult(false);
        }
      }, 2000);
    } else {
      setQueryResult(res.result);
      setErrorExecuteQuery(res?.error);
      setIsLoadingResult(false);
    }
  };

  const fetchQueryResult = async () => {
    setIsLoadingResult(true);
    const executedResponse: QueryExecutedResponse = await rf
      .getRequest('DashboardsRequest')
      .executePublicQuery(queryId);
    const executionId = executedResponse.id;
    await getExecutionResultById(executionId);
  };

  const fetchQuery = async () => {
    try {
      const dataQuery = await rf
        .getRequest('DashboardsRequest')
        .getPublicQueryById({ queryId });
      setQueryValue(dataQuery);
      // set query into editor
      if (!editorRef.current) {
        return;
      }
      const position = editorRef.current.editor.getCursorPosition();
      editorRef.current.editor.setValue('');
      editorRef.current.editor.session.insert(position, dataQuery?.query);
    } catch (error: any) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const fetchInitalData = async () => {
    try {
      await fetchQuery();
      await fetchQueryResult();
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const onExpandEditor = () => {
    if (errorExecuteQuery || !queryId || !queryValue) return;
    setExpandLayout((prevState) => {
      if (prevState === LAYOUT_QUERY.FULL) {
        return LAYOUT_QUERY.HIDDEN;
      }
      if (prevState === LAYOUT_QUERY.HIDDEN) {
        return LAYOUT_QUERY.FULL;
      }
      return LAYOUT_QUERY.FULL;
    });
  };

  const classExpand = (
    layout: string,
    firstClass: string,
    secondClass: string,
  ) => {
    if (isLoadingResult) return 'add-chart-loading-public';
    if (errorExecuteQuery) return;
    if (!queryId || !queryValue) return 'custom-editor--full';
    return expandLayout === layout ? firstClass : secondClass;
  };

  const onCheckedIconExpand = () => {
    if (errorExecuteQuery || !queryId || !queryValue)
      return 'icon-query-collapse';
    return expandLayout === LAYOUT_QUERY.HIDDEN
      ? 'icon-query-expand'
      : 'icon-query-collapse';
  };

  const _renderAddChart = () => {
    return (
      <div className="header-empty">
        <Flex alignItems={'center'} gap="16px">
          <div className="item-add-chart active-table">
            <QueryResultIcon />
            Result Table
          </div>
          <div className="item-add-chart">
            <AddChartIcon />
            Add Chart
          </div>
        </Flex>
        <p className="icon-query-expand cursor-not-allowed" />
      </div>
    );
  };

  const _renderContent = () => {
    if (isLoadingResult) {
      return (
        <>
          {_renderAddChart()}
          <AppLoadingTable widthColumns={[100]} className="visual-table" />
        </>
      );
    }

    if (!!queryValue && !!queryResult.length && !errorExecuteQuery?.message) {
      return (
        <Box>
          <VisualizationDisplay
            queryResult={queryResult}
            queryValue={queryValue}
            needAuthentication={false}
            onReload={fetchQuery}
            expandLayout={expandLayout}
            onExpand={setExpandLayout}
          />
        </Box>
      );
    }

    return (
      <>
        {_renderAddChart()}
        <Flex
          className="empty-table"
          justifyContent={'center'}
          alignItems="center"
          flexDirection="column"
        >
          <span className="execution-error">Execution Error</span>
          {errorExecuteQuery?.message || 'No data...'}
        </Flex>
      </>
    );
  };

  const _renderVisualizations = () => {
    if (!queryId || !queryValue) {
      return null;
    }

    return (
      <div
        className={`
        ${errorExecuteQuery ? 'add-chart-empty' : ''}
        ${classExpand(LAYOUT_QUERY.FULL, 'add-chart-full', 'add-chart')}
        ${classExpand(LAYOUT_QUERY.HIDDEN, 'expand-chart hidden-editor', '')} `}
      >
        {_renderContent()}
      </div>
    );
  };

  return (
    <div className="workspace-page__editor__query">
      <Header
        type={LIST_ITEM_TYPE.QUERIES}
        author={
          queryClass?.getUser().firstName && queryClass?.getUser().lastName
            ? `${queryClass?.getUser().firstName} ${
                queryClass?.getUser().lastName
              }`
            : ''
        }
        data={queryValue}
        needAuthentication={false}
      />
      <div className="query-container queries-page">
        <Box className="queries-page__right-side">
          <Box className="editor-wrapper ">
            <Tooltip
              label={
                expandLayout === LAYOUT_QUERY.HIDDEN ? 'Maximize' : 'Minimize'
              }
              hasArrow
              placement="top"
              bg="white"
              color="black"
            >
              <div
                className={`${
                  errorExecuteQuery || !queryId || !queryValue
                    ? 'cursor-not-allowed'
                    : ''
                } btn-expand-public`}
              >
                <p
                  className={`${onCheckedIconExpand()}`}
                  onClick={onExpandEditor}
                />
              </div>
            </Tooltip>
            <AceEditor
              className={`ace_editor ace-tomorrow custom-editor 
                ${errorExecuteQuery ? 'custom-editor--half' : ''}
                ${classExpand(
                  LAYOUT_QUERY.FULL,
                  'custom-editor--full',
                  '',
                )} ${classExpand(
                LAYOUT_QUERY.HIDDEN,
                'custom-editor--hidden',
                '',
              )}`}
              ref={editorRef}
              mode="sql"
              theme="tomorrow"
              width="100%"
              wrapEnabled={true}
              readOnly
              focus={false}
              name="sql_editor"
              editorProps={{ $blockScrolling: true }}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableLiveAutocompletion: true,
                enableBasicAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </Box>
          {_renderVisualizations()}
        </Box>
      </div>
    </div>
  );
};

export default QueryPart;
