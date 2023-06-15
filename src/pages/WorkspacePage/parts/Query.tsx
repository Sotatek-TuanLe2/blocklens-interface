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
  LAYOUT_QUERY,
} from 'src/utils/query.type';
import 'src/styles/pages/QueriesPage.scss';
import { toastError } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import { TYPE_OF_MODAL, QUERY_RESULT_STATUS } from 'src/utils/common';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { EditorContext } from '../context/EditorContext';
import Header from './Header';
import VisualizationDisplay from './VisualizationDisplay';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { BROADCAST_FETCH_WORKPLACE_DATA } from './Sidebar';
import ModalQuery from 'src/modals/querySQL/ModalQuery';
import { Query } from 'src/utils/utils-query';
import { AddChartIcon } from 'src/assets/icons';

export const BROADCAST_ADD_TEXT_TO_EDITOR = 'ADD_TEXT_TO_EDITOR';
export const BROADCAST_FETCH_QUERY = 'FETCH_QUERY';

const QueryPart: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();

  const DEBOUNCE_TIME = 500;
  const editorRef = useRef<any>();
  const [queryResult, setQueryResult] = useState<any>([]);
  const [queryValue, setQueryValue] = useState<IQuery | null>(null);
  const [expandLayout, setExpandLayout] = useState<string>(LAYOUT_QUERY.HIDDEN);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
  const [errorExecuteQuery, setErrorExecuteQuery] =
    useState<IErrorExecuteQuery | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<string>('');
  const fetchQueryResultInterval = useRef<any>(null);
  const [openModalSettingQuery, setOpenModalSettingQuery] =
    useState<boolean>(false);

  const onAddTextToEditor = (text: string) => {
    const position = editorRef.current.editor.getCursorPosition();

    editorRef.current.editor.session.insert(position, text);
    editorRef.current.editor.focus();
  };

  useEffect(() => {
    AppBroadcast.on(BROADCAST_ADD_TEXT_TO_EDITOR, onAddTextToEditor);
    AppBroadcast.on(
      BROADCAST_FETCH_QUERY,
      async (id: string) => await fetchQuery(id),
    );

    return () => {
      AppBroadcast.remove(BROADCAST_ADD_TEXT_TO_EDITOR, onAddTextToEditor);
      AppBroadcast.remove(BROADCAST_FETCH_QUERY);
    };
  }, []);

  useEffect(() => {
    if (queryId) {
      fetchInitalData();
      setExpandLayout(LAYOUT_QUERY.HIDDEN);
    } else {
      resetEditor();
    }

    return () => {
      if (fetchQueryResultInterval.current) {
        clearInterval(fetchQueryResultInterval.current);
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
    editorRef.current && editorRef.current.editor.setValue('');
    setSelectedQuery('');
  };

  const updateQuery = async (query: string) => {
    try {
      await rf.getRequest('DashboardsRequest').updateQuery({ query }, queryId);
      await fetchQuery();
      await fetchQueryResult();
    } catch (error: any) {
      toastError({ message: getErrorMessage(error) });
    }
  };

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
          setIsLoadingResult(false);
        }
      }, 2000);
    } else {
      setQueryResult(res.result);
      setErrorExecuteQuery(res?.error || null);
      setIsLoadingResult(false);
    }
  };

  const fetchQueryResult = async () => {
    setIsLoadingResult(true);
    const executedResponse: QueryExecutedResponse = await rf
      .getRequest('DashboardsRequest')
      .executeQuery(queryId);
    const executionId = executedResponse.id;
    await getExecutionResultById(executionId);
  };

  const fetchQuery = async (id?: string) => {
    try {
      const dataQuery = await rf
        .getRequest('DashboardsRequest')
        .getMyQueryById({ queryId: id || queryId });
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

  const onSelectQuery = debounce((value) => {
    if (queryId) {
      setSelectedQuery(value.session.getTextRange());
    }
  }, DEBOUNCE_TIME);

  const executeSelectedQuery = async () => {
    try {
      setIsLoadingResult(true);
      const executedResponse: QueryExecutedResponse = await rf
        .getRequest('DashboardsRequest')
        .getTemporaryQueryResult(selectedQuery);
      const executionId = executedResponse.id;
      await getExecutionResultById(executionId);
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
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
        await updateQuery(query);
      } else {
        setOpenModalSettingQuery(true);
      }
    } catch (err: any) {
      toastError({ message: getErrorMessage(err) });
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

  const onCheckedIconExpand = () => {
    if (errorExecuteQuery || !queryId || !queryValue)
      return 'icon-query-collapse';
    return expandLayout === LAYOUT_QUERY.HIDDEN
      ? 'icon-query-expand'
      : 'icon-query-collapse';
  };

  const _renderContent = () => {
    if (isLoadingResult) {
      return <AppLoadingTable widthColumns={[100]} className="visual-table" />;
    }

    if (!!queryValue && !!queryResult.length && !errorExecuteQuery?.message) {
      return (
        <Box>
          <VisualizationDisplay
            queryResult={queryResult}
            queryValue={queryValue}
            onReload={fetchQuery}
            expandLayout={expandLayout}
            onExpand={setExpandLayout}
          />
        </Box>
      );
    }
    return (
      <Flex
        className="empty-table"
        justifyContent={'center'}
        alignItems="center"
        flexDirection="column"
      >
        <span className="execution-error">Execution Error</span>
        {errorExecuteQuery?.message || 'No data...'}
      </Flex>
    );
  };

  const classExpand = (
    layout: string,
    firstClass: string,
    secondClass: string,
  ) => {
    if (errorExecuteQuery) return;
    if (!queryId || !queryValue) return 'custom-editor--full';
    return expandLayout === layout ? firstClass : secondClass;
  };

  const _renderVisualizations = () => {
    if (!queryId || !queryValue) {
      return (
        <div className="empty-query">
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
              Add Chart
            </Flex>
          </Tooltip>
          <p className="icon-query-expand cursor-not-allowed" />
        </div>
      );
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
          queryClass
            ? `${queryClass?.getUser().firstName} ${
                queryClass?.getUser().lastName
              }`
            : ''
        }
        data={queryValue}
        isLoadingRun={isLoadingResult}
        onRunQuery={onRunQuery}
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
            <Box className="editor-wrapper">
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
                  } btn-expand-query`}
                >
                  <p
                    className={`${onCheckedIconExpand()}`}
                    onClick={onExpandEditor}
                  />
                </div>
              </Tooltip>
            </Box>
            {_renderVisualizations()}
          </Box>
        </div>
      </EditorContext.Provider>
      {openModalSettingQuery && (
        <ModalQuery
          open={openModalSettingQuery}
          onClose={() => setOpenModalSettingQuery(false)}
          onSuccess={async () => {
            AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
            await fetchQuery();
          }}
          type={TYPE_OF_MODAL.CREATE}
          query={editorRef.current.editor.getValue()}
        />
      )}
    </div>
  );
};

export default QueryPart;
