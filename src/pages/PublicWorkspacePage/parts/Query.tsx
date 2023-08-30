import { Box, Flex } from '@chakra-ui/react';
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
import { toastError } from 'src/utils/utils-notify';
import { Query } from 'src/utils/utils-query';
import { STATUS } from 'src/utils/utils-webhook';
import Storage from 'src/utils/utils-storage';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

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
  const [panelHeight, setPanelHeight] = useState<any>(
    Storage.getHeightPanelQuery() || '600',
  );

  const fetchQueryResultTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleSecondaryPaneSizeChange = (secondaryPaneSize: string) => {
    Storage.setHeightPanelQuery(secondaryPaneSize);
    setPanelHeight(secondaryPaneSize);
  };

  const queryClass = useMemo(() => {
    if (!queryValue) {
      return null;
    }
    return new Query(queryValue);
  }, [queryValue]);

  useEffect(() => {
    if (queryId) {
      fetchInitialData();
      setExpandLayout(LAYOUT_QUERY.HIDDEN);
    }

    return () => {
      if (fetchQueryResultTimeout.current) {
        clearTimeout(fetchQueryResultTimeout.current);
      }
    };
  }, [queryId]);

  const getExecutionResultById = async (executionId: string) => {
    clearTimeout(fetchQueryResultTimeout.current);
    const res = await rf.getRequest('DashboardsRequest').getQueryResult({
      executionId,
    });
    if (res.status === QUERY_RESULT_STATUS.WAITING) {
      fetchQueryResultTimeout.current = setTimeout(
        () => getExecutionResultById(executionId),
        2000,
      );
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
      if (!dataQuery) {
        setIsLoadingResult(false);
        editorRef.current.editor.setValue('');
        toastError({ message: 'Query does not exists' });
        return null;
      }
      const position = editorRef.current.editor.getCursorPosition();
      editorRef.current.editor.setValue('');
      editorRef.current.editor.session.insert(position, dataQuery?.query);
      return dataQuery;
    } catch (error: any) {
      setIsLoadingQuery(false);
      if (error.message) {
        toastError({ message: error.message.toString() });
      }
      console.error(error);
      return null;
    }
  };

  const fetchInitialData = async () => {
    try {
      const dataQuery = await fetchQuery();
      await fetchQueryResult(dataQuery?.executedId);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpandEditor = () => {
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

  const getIconClassName = (query: boolean) => {
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
          onClick={toggleExpandEditor}
          className={`${getIconClassName(false)}`}
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

    if (
      !!queryValue &&
      !!queryResult.length &&
      statusExecuteQuery === STATUS.DONE
    ) {
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
            {statusExecuteQuery === STATUS.DONE &&
              !queryResult.length &&
              'No data...'}
            {statusExecuteQuery === STATUS.FAILED && (
              <>
                <span className="execution-error">Execution Error</span>
                {errorExecuteQuery?.message || 'No data...'}
              </>
            )}
          </Flex>
        )}
      </>
    );
  };

  const _renderVisualizations = () => {
    if (!queryId || !queryValue) {
      return null;
    }

    return <>{_renderContent()}</>;
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
          <SplitterLayout
            primaryIndex={0}
            primaryMinSize={50}
            secondaryMinSize={120}
            vertical
            onSecondaryPaneSizeChange={handleSecondaryPaneSizeChange}
            secondaryInitialSize={panelHeight}
          >
            <Box className="editor-wrapper">
              <div
                className={`${
                  !queryId || !queryValue ? 'cursor-not-allowed' : ''
                } btn-expand-public`}
              >
                <p
                  className={`${getIconClassName(true)}`}
                  onClick={toggleExpandEditor}
                />
              </div>
              <AceEditor
                className={`ace_editor ace-tomorrow custom-editor`}
                ref={editorRef}
                mode="sql"
                theme="tomorrow"
                width="93%"
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
          </SplitterLayout>
        </Box>
      </div>
    </div>
  );
};

export default QueryPart;
