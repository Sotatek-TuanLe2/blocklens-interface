import { Box, Flex, Tooltip } from '@chakra-ui/react';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-tomorrow';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import { useParams } from 'react-router-dom';
import { QueryResultIcon } from 'src/assets/icons';
import { AppLoadingTable } from 'src/components';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import Header from 'src/pages/WorkspacePage/parts/Header';
import VisualizationDisplay from 'src/pages/WorkspacePage/parts/VisualizationDisplay';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/QueriesPage.scss';
import { QUERY_RESULT_STATUS } from 'src/utils/common';
import { IErrorExecuteQuery, IQuery, LAYOUT_QUERY } from 'src/utils/query.type';
import { Query } from 'src/utils/utils-query';
import { STATUS } from 'src/utils/utils-webhook';

const QueryPart: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();
  const editorRef = useRef<any>();

  const [queryResult, setQueryResult] = useState<any>([]);
  const [queryValue, setQueryValue] = useState<IQuery | null>(null);
  const [expandLayout, setExpandLayout] = useState<string>(LAYOUT_QUERY.HIDDEN);
  const [isLoadingQuery, setIsLoadingQuery] = useState<boolean>(!!queryId);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
  const [errorExecuteQuery, setErrorExecuteQuery] =
    useState<IErrorExecuteQuery>();
  const [isExpand, setIsExpand] = useState<boolean>(true);
  const [statusExecuteQuery, setStatusExecuteQuery] = useState<string>();

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
          setErrorExecuteQuery(resInterval?.error || null);
          setStatusExecuteQuery(resInterval?.status);
          setIsLoadingResult(false);
        }
      }, 2000);
    } else {
      setQueryResult(res.result);
      setErrorExecuteQuery(res?.error || null);
      setStatusExecuteQuery(res?.status);
      setIsLoadingResult(false);
    }
  };

  const fetchQueryResult = async (executionId?: string) => {
    if (!executionId) {
      return;
    }
    setIsLoadingResult(true);
    await getExecutionResultById(executionId);
  };

  const fetchQuery = async (): Promise<IQuery | null> => {
    setIsLoadingQuery(true);
    try {
      const dataQuery = await rf
        .getRequest('DashboardsRequest')
        .getPublicQueryById({ queryId });
      setQueryValue(dataQuery);
      setIsLoadingQuery(false);
      // set query into editor
      if (!editorRef.current) {
        return null;
      }
      const position = editorRef.current.editor.getCursorPosition();
      editorRef.current.editor.setValue('');
      editorRef.current.editor.session.insert(position, dataQuery?.query);
      setIsLoadingQuery(false);
      return dataQuery;
    } catch (error: any) {
      setIsLoadingQuery(false);
      console.error(error);
      return null;
    }
  };

  const fetchInitalData = async () => {
    try {
      const dataQuery = await fetchQuery();
      await fetchQueryResult(dataQuery?.executedId);
    } catch (error) {
      console.error(error);
    }
  };

  const onExpandEditor = () => {
    setIsExpand(false);
    if (!queryId || !queryValue) return;
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
    if (statusExecuteQuery === STATUS.FAILED && isExpand)
      return 'custom-editor--half';
    if (isLoadingResult) return 'add-chart-loading-public';
    if (!queryId || !queryValue) return 'custom-editor--full';
    return expandLayout === layout ? firstClass : secondClass;
  };

  const onCheckedIconExpand = (query: boolean) => {
    if (!queryId || !queryValue)
      return query ? 'icon-query-collapse' : 'icon-query-expand';

    if (expandLayout === LAYOUT_QUERY.HALF)
      return query ? 'icon-query-expand' : 'icon-query-collapse';

    return expandLayout === LAYOUT_QUERY.HIDDEN
      ? query
        ? 'icon-query-expand'
        : 'icon-query-collapse'
      : query
      ? 'icon-query-collapse'
      : 'icon-query-expand';
  };

  const _renderAddChart = () => {
    return (
      <div className="header-empty">
        <div className="item-add-chart active-table">
          <QueryResultIcon />
          Result Table
        </div>
        <p
          onClick={onExpandEditor}
          className={`${onCheckedIconExpand(false)}`}
        />
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
        {(expandLayout === LAYOUT_QUERY.HIDDEN ||
          expandLayout === LAYOUT_QUERY.HALF) && (
          <Flex
            className="empty-table"
            justifyContent={'center'}
            alignItems="center"
            flexDirection="column"
          >
            <span className="execution-error">Execution Error</span>

            {(statusExecuteQuery === STATUS.FAILED &&
              errorExecuteQuery?.message) ||
              'No data...'}
          </Flex>
        )}
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
        ${
          statusExecuteQuery === STATUS.FAILED && isExpand
            ? 'add-chart-empty'
            : ''
        }
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
          queryClass
            ? `${queryClass?.getUserFirstName()} ${queryClass?.getUserLastName()}`
            : ''
        }
        isLoadingRun={isLoadingQuery}
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
                  !queryId || !queryValue ? 'cursor-not-allowed' : ''
                } btn-expand-public`}
              >
                <p
                  className={`${onCheckedIconExpand(true)}`}
                  onClick={onExpandEditor}
                />
              </div>
            </Tooltip>
            <AceEditor
              className={`ace_editor ace-tomorrow custom-editor 
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
