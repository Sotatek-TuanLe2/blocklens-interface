import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { useParams } from 'react-router-dom';
import { AppLoadingTable } from 'src/components';
import { getErrorMessage } from 'src/utils/utils-helper';
import {
  QueryExecutedResponse,
  IQuery,
  IErrorExecuteQuery,
} from 'src/utils/query.type';
import 'src/styles/pages/QueriesPage.scss';
import { toastError } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import {
  TYPE_OF_MODAL,
  QUERY_RESULT_STATUS,
  ROUTES,
  DEFAULT_QUERY_VISUALIZATION_HEIGHT,
} from 'src/utils/common';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { EditorContext } from '../context/EditorContext';
import Header from './Header';
import VisualizationDisplay from './VisualizationDisplay';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { BROADCAST_FETCH_WORKPLACE_DATA } from './Sidebar';
import ModalQuery from 'src/modals/querySQL/ModalQuery';
import { Query } from 'src/utils/utils-query';
import { AddChartIcon, QueryResultIcon } from 'src/assets/icons';
import { STATUS } from 'src/utils/utils-webhook';
import useOriginPath from 'src/hooks/useOriginPath';
import { isMobile } from 'react-device-detect';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

export const BROADCAST_FETCH_QUERY = 'FETCH_QUERY';
export const BROADCAST_ADD_TO_EDITOR = 'ADD_TO_EDITOR';

const QueryPart: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();
  const { goWithOriginPath } = useOriginPath();

  const DEBOUNCE_TIME = 500;
  const editorRef = useRef<any>();
  const visualizationHeightRef = useRef<number>();

  const [isTemporary, setIsTemporary] = useState<boolean>(false);
  const [createQueryId, setCreateQueryId] = useState<string>('');
  const [queryResult, setQueryResult] = useState<any>([]);
  const [queryValue, setQueryValue] = useState<IQuery | null>(null);
  const [visualizationHeight, setVisualizationHeight] = useState<number>(
    DEFAULT_QUERY_VISUALIZATION_HEIGHT,
  );
  const [isLoadingQuery, setIsLoadingQuery] = useState<boolean>(!!queryId);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
  const [errorExecuteQuery, setErrorExecuteQuery] =
    useState<IErrorExecuteQuery | null>(null);
  const [statusExecuteQuery, setStatusExecuteQuery] = useState<string>();
  const [selectedQuery, setSelectedQuery] = useState<string>('');
  const [openModalSettingQuery, setOpenModalSettingQuery] =
    useState<boolean>(false);
  const [allowCancelExecution, setAllowCancelExecution] =
    useState<boolean>(false);

  const fetchQueryResultTimeout = useRef<ReturnType<typeof setTimeout>>();
  const currentExecutionId = useRef<string>();
  const isLoading = isLoadingQuery || isLoadingResult;

  useEffect(() => {
    AppBroadcast.on(BROADCAST_FETCH_QUERY, async (id: string) => {
      setIsLoadingQuery(true);
      await fetchQuery(id);
    });
    AppBroadcast.on(BROADCAST_ADD_TO_EDITOR, (text: string) => {
      if (editorRef.current) {
        editorRef.current.editor.session.insert(
          editorRef.current.editor.getCursorPosition(),
          ` ${text} `,
        );
        editorRef.current.editor.focus();
      }
    });
    const onSpellcheck = () => {
      // for fixing typing issue in editor only in MacOS
      editorRef.current.refEditor.firstChild.blur();
      editorRef.current.refEditor.firstChild.focus();
    };

    editorRef?.current?.refEditor?.firstChild?.addEventListener(
      'input',
      onSpellcheck,
    );

    return () => {
      AppBroadcast.remove(BROADCAST_FETCH_QUERY);
      AppBroadcast.remove(BROADCAST_ADD_TO_EDITOR);
      editorRef?.current?.refEditor?.firstChild?.removeEventListener(
        'input',
        onSpellcheck,
      );
    };
  }, []);

  useEffect(() => {
    if (queryId) {
      fetchInitialData();
    } else {
      resetEditor();
    }

    return () => {
      if (fetchQueryResultTimeout.current) {
        clearTimeout(fetchQueryResultTimeout.current);
      }
    };
  }, [queryId]);

  const queryClass = useMemo(() => {
    if (!queryValue) {
      return null;
    }
    return new Query(queryValue);
  }, [queryValue]);

  const resetEditor = () => {
    if (editorRef.current) {
      editorRef.current.editor.setValue('');
      editorRef.current.editor.focus();
    }
    setIsTemporary(false);
    setQueryResult([]);
    setQueryValue(null);
    setCreateQueryId('');
    setIsLoadingResult(false);
    setErrorExecuteQuery(null);
    setSelectedQuery('');
    setStatusExecuteQuery('');
  };

  const runQuery = async (query: string) => {
    try {
      setIsLoadingResult(true);
      const executionId = await executeQuery(query, queryId);
      setAllowCancelExecution(true);
      currentExecutionId.current = executionId;
      await fetchQueryResult(executionId);
    } catch (error: any) {
      console.error(error);
      setIsLoadingResult(false);
      toastError({ message: getErrorMessage(error) });
    }
  };

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
        clearTimeout(fetchQueryResultTimeout.current);
        setQueryResult(res.result);
        setErrorExecuteQuery(res?.error || null);
        setStatusExecuteQuery(res?.status);
        setCreateQueryId(res.queryId);
        setIsLoadingResult(false);
        setAllowCancelExecution(false);
      }
    } catch (error) {
      console.error(error);
      clearTimeout(fetchQueryResultTimeout.current);
      setIsLoadingResult(false);
      setAllowCancelExecution(false);
    }
  };

  const executeQuery = async (
    statement: string,
    queryId?: string,
  ): Promise<any> => {
    const executedResponse: QueryExecutedResponse = await rf
      .getRequest('DashboardsRequest')
      .executeQuery({ id: queryId, statement });
    if (!executedResponse || !executedResponse.id) {
      throw new Error('Execute query failed!');
    }
    const executionId = executedResponse.id;
    return executionId;
  };

  const fetchQueryResult = async (executionId?: string) => {
    if (!executionId) {
      return;
    }
    setIsLoadingResult(true);
    currentExecutionId.current = executionId;
    await getExecutionResultById(executionId);
  };

  const fetchQuery = async (id?: string): Promise<IQuery | null> => {
    try {
      const dataQuery = await rf
        .getRequest('DashboardsRequest')
        .getMyQueryById({ queryId: id || queryId });
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
      setIsLoadingResult(false);
      editorRef.current.editor.setValue('');
      if (error.message) {
        toastError({ message: error.message.toString() });
      }
      console.error(error);
      return null;
    }
  };

  const fetchInitialData = async () => {
    setIsTemporary(false);
    setIsLoadingQuery(true);
    const dataQuery = await fetchQuery();
    await fetchQueryResult(
      dataQuery?.pendingExecutionId || dataQuery?.executedId,
    );
  };

  const onSelectQuery = debounce((value) => {
    if (queryId) {
      setSelectedQuery(value.session.getTextRange());
    }
  }, DEBOUNCE_TIME);

  const executeSelectedQuery = async () => {
    setIsLoadingResult(true);
    try {
      const executedResponse: QueryExecutedResponse = await rf
        .getRequest('DashboardsRequest')
        .executeQuery({ statement: selectedQuery });
      const executionId = executedResponse.id;
      await fetchQueryResult(executionId);
      setIsLoadingResult(false);
    } catch (error) {
      setIsLoadingResult(false);
      console.error(error);
    }
  };

  const runInitialQuery = async (query: string) => {
    setIsTemporary(true);
    setIsLoadingResult(true);
    const executionId = await executeQuery(query, queryId);
    await fetchQueryResult(executionId);
  };

  const onRunQuery = async () => {
    if (selectedQuery) {
      return executeSelectedQuery();
    }
    try {
      const query = editorRef.current.editor.getValue();
      if (!query) {
        toastError({ message: 'Query must not be empty!' });
        return;
      }
      if (queryId) {
        await runQuery(query);
      } else {
        await runInitialQuery(query);
      }
    } catch (error) {
      setIsLoadingResult(false);
      toastError({ message: getErrorMessage(error) });
    }
  };

  const onCancelExecution = async () => {
    if (!currentExecutionId.current) {
      return;
    }

    try {
      if (fetchQueryResultTimeout.current) {
        clearTimeout(fetchQueryResultTimeout.current);
      }
      await rf
        .getRequest('DashboardsRequest')
        .cancelQueryExecution(currentExecutionId.current);
      setIsTemporary(false);
      setIsLoadingResult(false);
      setAllowCancelExecution(false);
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
      setIsLoadingResult(false);
      setAllowCancelExecution(false);
    }
  };

  const onSuccessCreateQuery = async (queryResponse: any) => {
    goWithOriginPath(`${ROUTES.MY_QUERY}/${queryResponse.id}`);
    AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
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
    if (isLoading) {
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

    if (!!queryResult.length && statusExecuteQuery === STATUS.DONE) {
      return (
        <Box>
          <VisualizationDisplay
            queryResult={queryResult}
            queryValue={queryValue}
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
    if (!isTemporary && !queryId) {
      return (
        <div className="empty-query">
          <Flex
            alignItems="center"
            justifyContent="space-between"
            className="empty-query__main-header"
          >
            <Tooltip
              label="Visualization need data from result table."
              hasArrow
              bg="white"
              color="black"
            >
              <Flex alignItems={'center'}>
                <Box mr={2}>
                  <AddChartIcon />
                </Box>{' '}
                {!isMobile && 'Add Chart'}
              </Flex>
            </Tooltip>
          </Flex>
        </div>
      );
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
        data={queryValue}
        isLoadingRun={isLoadingQuery}
        isLoadingResult={isLoadingResult}
        isTemporaryQuery={isTemporary}
        allowCancelExecution={allowCancelExecution}
        onRunQuery={onRunQuery}
        onCancelExecution={onCancelExecution}
        onSaveQuery={() => setOpenModalSettingQuery(true)}
        selectedQuery={selectedQuery}
      />
      <EditorContext.Provider
        value={{
          editor: editorRef,
          queryResult: queryResult,
        }}
      >
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
                <AceEditor
                  className={`ace_editor ace-tomorrow custom-editor`}
                  ref={editorRef}
                  mode="sql"
                  theme="tomorrow"
                  width="93%"
                  wrapEnabled={true}
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
                  onSelectionChange={onSelectQuery}
                />
              </Box>
              {_renderVisualizations()}
            </SplitterLayout>
          </Box>
        </div>
      </EditorContext.Provider>
      {openModalSettingQuery && (
        <ModalQuery
          open={openModalSettingQuery}
          onClose={() => setOpenModalSettingQuery(false)}
          onSuccess={onSuccessCreateQuery}
          type={TYPE_OF_MODAL.CREATE}
          query={editorRef.current.editor.getValue()}
          createQueryId={createQueryId}
        />
      )}
    </div>
  );
};

export default QueryPart;
