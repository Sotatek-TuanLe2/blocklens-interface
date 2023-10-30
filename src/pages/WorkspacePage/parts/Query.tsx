import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import SplitPane from 'react-split-pane';
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
import QueryTabs from './QueryTabs';
import Storage from 'src/utils/utils-storage';

export const BROADCAST_FETCH_QUERY = 'FETCH_QUERY';
export const BROADCAST_ADD_TO_EDITOR = 'ADD_TO_EDITOR';
export const UNSAVED_QUERY = 'unsaved_query';
export const UNSAVED_QUERY_TITLE = 'Unsaved query';

export interface IQueryTab {
  id: string;
  name: string;
  isUnsaved?: boolean;
  query?: string;
  results?: any[];
  isFirstRun?: boolean;
  statusExecuteQuery?: string;
  errorExecuteQuery?: IErrorExecuteQuery;
}

const QueryPart: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();
  const { search: searchUrl } = useLocation();
  const { goWithOriginPath } = useOriginPath();
  const history = useHistory();

  const DEBOUNCE_TIME = 500;
  const editorRef = useRef<any>();
  const searchParams = new URLSearchParams(searchUrl);

  // states for using tabs
  const [tabs, setTabs] = useState<IQueryTab[]>(Storage.getEditorTabs());

  const [createQueryId, setCreateQueryId] = useState<string>('');
  const [queryValue, setQueryValue] = useState<IQuery | null>(null);
  const [visualizationHeight, setVisualizationHeight] = useState<number>(
    DEFAULT_QUERY_VISUALIZATION_HEIGHT,
  );
  const [isLoadingQuery, setIsLoadingQuery] = useState<boolean>(!!queryId);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
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
      editorRef.current.editor.setValue('');
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

    return () => {
      AppBroadcast.remove(BROADCAST_FETCH_QUERY);
      AppBroadcast.remove(BROADCAST_ADD_TO_EDITOR);
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
  }, [queryId, searchUrl]);

  useEffect(() => {
    debounce(() => {
      Storage.setEditorTabs(
        tabs
          .filter((item) => !item.isUnsaved)
          .map((item) => ({
            id: item.id,
            name: item.name,
          })),
      );
    }, DEBOUNCE_TIME)();
  }, [tabs]);

  const queryClass = useMemo(() => {
    if (!queryValue) {
      return null;
    }
    return new Query(queryValue);
  }, [queryValue]);

  const activeTabId = useMemo(
    () => queryId || searchParams.get(UNSAVED_QUERY) || '',
    [queryId, searchUrl],
  );

  const currentTab = useMemo(
    () => tabs.find((item) => item.id === activeTabId),
    [activeTabId, tabs],
  );

  const addTabWithUnsavedQuery = () => {
    const unsavedQueryId = searchParams.get(UNSAVED_QUERY);
    if (unsavedQueryId) {
      if (!tabs.some((item) => item.id === unsavedQueryId)) {
        setTabs((prevState) => [
          ...prevState,
          { id: unsavedQueryId, name: UNSAVED_QUERY_TITLE, isUnsaved: true },
        ]);
      }
    } else {
      const intialId = new Date().valueOf().toString();
      history.push(`${ROUTES.MY_QUERY}?${UNSAVED_QUERY}=${intialId}`);
    }
  };

  const resetEditor = () => {
    addTabWithUnsavedQuery();
    if (editorRef.current) {
      editorRef.current.editor.setValue('');
      const position = editorRef.current.editor.getCursorPosition();
      editorRef.current.editor.session.insert(
        position,
        currentTab?.query || '',
      );
      editorRef.current.editor.focus();
    }

    setQueryValue(null);
    setCreateQueryId('');
    setIsLoadingResult(false);
    setSelectedQuery('');
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

  const getExecutionResultById = async (
    executionId: string,
    queryValue?: IQuery | null,
    tabs?: IQueryTab[],
  ) => {
    try {
      clearTimeout(fetchQueryResultTimeout.current);
      const res = await rf.getRequest('DashboardsRequest').getQueryResult({
        executionId,
      });
      if (res.status === QUERY_RESULT_STATUS.WAITING) {
        fetchQueryResultTimeout.current = setTimeout(
          () => getExecutionResultById(executionId, queryValue),
          2000,
        );
      } else {
        clearTimeout(fetchQueryResultTimeout.current);
        setCreateQueryId(res.queryId);
        setIsLoadingResult(false);
        setAllowCancelExecution(false);
        setTabs((prevState) => {
          const newTabs = tabs ? [...tabs] : [...prevState];
          const currentTabIndex = newTabs.findIndex(
            (item) => item.id === activeTabId,
          );

          if (currentTabIndex < 0) {
            return [
              ...newTabs,
              {
                id: activeTabId,
                name: queryValue?.name || '',
                results: res.result,
                errorExecuteQuery: res?.error || null,
                statusExecuteQuery: res?.status,
              },
            ];
          } else {
            newTabs[currentTabIndex] = {
              ...newTabs[currentTabIndex],
              results: res.result,
              errorExecuteQuery: res?.error || null,
              statusExecuteQuery: res?.status,
              isFirstRun: newTabs[currentTabIndex].isUnsaved ? true : undefined,
            };
          }

          return newTabs;
        });
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

  const fetchQueryResult = async (
    executionId?: string,
    queryValue?: IQuery | null,
    tabs?: IQueryTab[],
  ) => {
    if (!executionId) {
      return;
    }
    setIsLoadingResult(true);
    currentExecutionId.current = executionId;
    await getExecutionResultById(executionId, queryValue, tabs);
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
        toastError({ message: 'Query does not exists' });
        return null;
      }
      const tab = tabs.find((item) => item.id === (id || queryId));
      const tabQuery = tab?.query;
      editorRef.current.editor.setValue('');
      const position = editorRef.current.editor.getCursorPosition();
      editorRef.current.editor.session.insert(
        position,
        tabQuery || dataQuery?.query,
      );
      editorRef.current.editor.focus();
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
    setIsLoadingQuery(true);
    editorRef.current.editor.setValue('');
    const dataQuery = await fetchQuery();
    const newTabs = updateCurrentTabWithQuery(dataQuery);
    await fetchQueryResult(
      dataQuery?.pendingExecutionId || dataQuery?.executedId,
      dataQuery,
      newTabs,
    );
  };

  const onSelectQuery = debounce((value) => {
    setSelectedQuery(value.session.getTextRange());
  }, DEBOUNCE_TIME);

  const onChangeEditor = debounce((value: string) => {
    setTabs((prevState) => {
      const newTabs = [...prevState];
      const tab = newTabs.find((item) => item.id === activeTabId);
      if (tab) {
        tab.query = value;
      }
      return newTabs;
    });
  }, DEBOUNCE_TIME);

  const executeSelectedQuery = async () => {
    setIsLoadingResult(true);
    const executionId = await executeQuery(selectedQuery);
    setAllowCancelExecution(true);
    await fetchQueryResult(executionId);
  };

  const runInitialQuery = async (query: string) => {
    setIsLoadingResult(true);
    const executionId = await executeQuery(query, queryId);
    setAllowCancelExecution(true);
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
      setIsLoadingResult(false);
      setAllowCancelExecution(false);
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
      setIsLoadingResult(false);
      setAllowCancelExecution(false);
    }
  };

  const updateCurrentTabWithQuery = (queryValue: IQuery | null) => {
    if (!queryValue) {
      return;
    }

    const newTabs = [...tabs];
    const index = newTabs.findIndex((item) => item.id === activeTabId);
    if (index > -1) {
      newTabs[index] = { id: queryValue.id, name: queryValue.name };
    } else {
      newTabs.push({ id: queryValue.id, name: queryValue.name });
    }
    setTabs(newTabs);
    return newTabs;
  };

  const onSuccessCreateQuery = async (queryResponse: any) => {
    // execute query again for making sure the query statement is synchronized
    await executeQuery(queryResponse.query, queryResponse.id);
    updateCurrentTabWithQuery(queryResponse);
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
    if (
      !!currentTab?.results?.length &&
      currentTab.statusExecuteQuery === STATUS.DONE
    ) {
      return (
        <VisualizationDisplay
          queryResult={currentTab?.results}
          queryValue={queryValue}
          containerHeight={visualizationHeight}
          onReload={fetchQuery}
        />
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
          {currentTab?.statusExecuteQuery === STATUS.DONE &&
            !currentTab.results?.length &&
            'No data...'}
          {currentTab?.statusExecuteQuery === STATUS.FAILED && (
            <>
              <span className="execution-error">Execution Error</span>
              {currentTab?.errorExecuteQuery?.message || 'No data...'}
            </>
          )}
        </Flex>
      </>
    );
  };

  const _renderVisualizations = () => {
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

    if (!currentTab?.results?.length && !currentTab?.errorExecuteQuery) {
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

    return _renderContent();
  };

  return (
    <div className="workspace-page__editor__query">
      <QueryTabs tabs={tabs} activeTab={activeTabId} onChangeTabs={setTabs} />
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
        isFirstRunQuery={currentTab?.isFirstRun}
        allowCancelExecution={allowCancelExecution}
        onRunQuery={onRunQuery}
        onCancelExecution={onCancelExecution}
        onSaveQuery={() => setOpenModalSettingQuery(true)}
        selectedQuery={selectedQuery}
      />
      <EditorContext.Provider
        value={{
          editor: editorRef,
          queryResult: currentTab?.results || [],
        }}
      >
        <div className="query-container queries-page">
          <Box className="queries-page__right-side">
            <SplitPane
              split="horizontal"
              size={visualizationHeight}
              primary="second"
              minSize={180}
              maxSize={-30}
              onDragFinished={(newSize) => setVisualizationHeight(newSize)}
              onResizerDoubleClick={() =>
                setVisualizationHeight(DEFAULT_QUERY_VISUALIZATION_HEIGHT)
              }
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
                  onChange={onChangeEditor}
                  onSelectionChange={onSelectQuery}
                />
              </Box>
              <Box className="visualization-wrapper">
                {_renderVisualizations()}
              </Box>
            </SplitPane>
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
