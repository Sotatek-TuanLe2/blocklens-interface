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
import {
  DEFAULT_QUERY_VISUALIZATION_HEIGHT,
  QUERY_RESULT_STATUS,
} from 'src/utils/common';
import { IErrorExecuteQuery, IQuery } from 'src/utils/query.type';
import { toastError } from 'src/utils/utils-notify';
import { Query } from 'src/utils/utils-query';
import { STATUS } from 'src/utils/utils-webhook';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

const QueryPart: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();
  const editorRef = useRef<any>();
  const visualizationHeightRef = useRef<number>();

  const [queryResult, setQueryResult] = useState<any>([]);
  const [queryValue, setQueryValue] = useState<IQuery | null>(null);
  const [visualizationHeight, setVisualizationHeight] = useState<number>(
    DEFAULT_QUERY_VISUALIZATION_HEIGHT,
  );
  const [isLoadingQuery, setIsLoadingQuery] = useState<boolean>(!!queryId);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
  const [errorExecuteQuery, setErrorExecuteQuery] =
    useState<IErrorExecuteQuery>();
  const [statusExecuteQuery, setStatusExecuteQuery] = useState<string>();

  const fetchQueryResultTimeout = useRef<ReturnType<typeof setTimeout>>();

  const queryClass = useMemo(() => {
    if (!queryValue) {
      return null;
    }
    return new Query(queryValue);
  }, [queryValue]);

  useEffect(() => {
    if (queryId) {
      fetchInitialData();
    }

    return () => {
      if (fetchQueryResultTimeout.current) {
        clearTimeout(fetchQueryResultTimeout.current);
      }
    };
  }, [queryId]);

  const getExecutionResultById = async (executionId: string) => {
    try {
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
    } catch (error) {
      console.error(error);
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
      editorRef.current.editor.setValue('');
      if (error.message) {
        toastError({ message: error.message.toString() });
      }
      console.error(error);
      return null;
    }
  };

  const fetchInitialData = async () => {
    const dataQuery = await fetchQuery();
    await fetchQueryResult(dataQuery?.executedId);
  };

  const _renderAddChart = () => {
    return (
      <div className="header-empty">
        <div className="item-add-chart active-table">
          <QueryResultIcon />
          Result Table
        </div>
      </div>
    );
  };

  const _renderContent = () => {
    if (isLoadingResult) {
      return (
        <>
          {_renderAddChart()}
          <AppLoadingTable
            widthColumns={[36, 22, 22, 22]}
            className="visual-table"
          />
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
            containerHeight={visualizationHeight}
            onReload={fetchQuery}
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
      </>
    );
  };

  const _renderVisualizations = () => {
    if (!queryId || !queryValue) {
      return null;
    }

    return <>{_renderContent()}</>;
  };

  const onChangeVisualizationHeight = (secondaryPanelSize: number) => {
    visualizationHeightRef.current = secondaryPanelSize;
  };

  const onDragEnd = () => {
    if (!visualizationHeightRef.current) {
      return;
    }
    setVisualizationHeight(visualizationHeightRef.current);
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
            primaryMinSize={30}
            secondaryMinSize={140}
            vertical
            secondaryInitialSize={visualizationHeight}
            onSecondaryPaneSizeChange={onChangeVisualizationHeight}
            onDragEnd={onDragEnd}
          >
            <Box className="editor-wrapper">
              <div
                className={`${
                  !queryId || !queryValue ? 'cursor-not-allowed' : ''
                } btn-expand-public`}
              ></div>
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
