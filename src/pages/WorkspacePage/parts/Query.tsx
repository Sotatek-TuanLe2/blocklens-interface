import { Box, Flex, Tooltip } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import { AppLoadingTable, AppTag } from 'src/components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContext } from '../context/EditorContext';
import VisualizationDisplay from './VisualizationDisplay';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import { getErrorMessage } from 'src/utils/utils-helper';
import { useHistory, useParams } from 'react-router-dom';
import {
  QueryExecutedResponse,
  IQuery,
  IErrorExecuteQuery,
  LAYOUT_QUERY,
} from 'src/utils/query.type';
import 'src/styles/pages/QueriesPage.scss';
import { toastError } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import useUser from 'src/hooks/useUser';
import { debounce } from 'lodash';
import { QUERY_RESULT_STATUS, ROUTES } from 'src/utils/common';
import { Query } from 'src/utils/utils-query';
import Header from './Header';
import { WORKSPACE_TYPES } from '..';
import moment from 'moment';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import AppNetworkIcons from 'src/components/AppNetworkIcons';
import { BROADCAST_FETCH_QUERIES_LIST } from './Sidebar';

export const BROADCAST_ADD_TEXT_TO_EDITOR = 'ADD_TEXT_TO_EDITOR';

const QueryPart: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();

  const DEBOUNCE_TIME = 500;
  const editorRef = useRef<any>();

  const [queryResult, setQueryResult] = useState<any>([]);
  const [queryValue, setQueryValue] = useState<IQuery | null>(null);
  const [expandLayout, setExpandLayout] = useState<string>(LAYOUT_QUERY.HALF);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
  const [errorExecuteQuery, setErrorExecuteQuery] =
    useState<IErrorExecuteQuery>();
  const [selectedQuery, setSelectedQuery] = useState<string>('');

  const fetchQueryResultInterval = useRef<any>(null);

  const history = useHistory();
  const { user } = useUser();

  const onAddTextToEditor = (text: string) => {
    const position = editorRef.current.editor.getCursorPosition();

    editorRef.current.editor.session.insert(position, text);
    editorRef.current.editor.focus();
  };

  useEffect(() => {
    AppBroadcast.on(BROADCAST_ADD_TEXT_TO_EDITOR, onAddTextToEditor);

    return () => {
      AppBroadcast.remove(BROADCAST_ADD_TEXT_TO_EDITOR, onAddTextToEditor);
    };
  }, []);

  useEffect(() => {
    if (queryId) {
      fetchInitalData();
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

  const createNewQuery = async (query: string) => {
    try {
      const queryValue: IQuery = await rf
        .getRequest('DashboardsRequest')
        .createNewQuery({
          name: moment().format('YYYY-MM-DD HH:mm a'),
          query,
        });
      await rf.getRequest('DashboardsRequest').executeQuery(queryValue.id);
      history.push(`${ROUTES.MY_QUERY}/${queryValue.id}`);
      AppBroadcast.dispatch(BROADCAST_FETCH_QUERIES_LIST);
    } catch (error: any) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const updateQuery = async (query: string) => {
    try {
      await rf.getRequest('DashboardsRequest').updateQuery({ query }, queryId);
      await fetchQueryResult();
      await fetchQuery();
    } catch (error: any) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const getExecutionResultById = async (executionId: string) => {
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
      .executeQuery(queryId);
    const executionId = executedResponse.id;
    await getExecutionResultById(executionId);
  };

  const fetchQuery = async () => {
    try {
      const dataQuery = await rf
        .getRequest('DashboardsRequest')
        .getMyQueryById({ queryId });
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
      await fetchQueryResult();
      await fetchQuery();
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
      if (queryId) {
        await updateQuery(editorRef.current.editor.getValue());
      } else {
        await createNewQuery(editorRef.current.editor.getValue());
      }
    } catch (err: any) {
      toastError({ message: getErrorMessage(err) });
    }
  };

  return (
    <div className="workspace-page__editor__query">
      <Header
        type={WORKSPACE_TYPES.QUERY}
        author={user?.getFirstName() || ''}
        title={queryClass?.getName() || ''}
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
              <Box className="header-tab">
                <div className="header-tab__info">
                  <AppNetworkIcons
                    networkIds={['eth_goerli', 'bsc_testnet', 'polygon_mainet']}
                  />
                  {['defi', 'gas', 'dex'].map((item) => (
                    <AppTag key={item} value={item} />
                  ))}
                </div>
                <Tooltip
                  label={
                    expandLayout === LAYOUT_QUERY.FULL
                      ? 'Minimize'
                      : expandLayout === LAYOUT_QUERY.HALF
                      ? 'Minimize'
                      : 'Maximum'
                  }
                  hasArrow
                  placement="top"
                >
                  <div className="btn-expand">
                    {expandLayout === LAYOUT_QUERY.FULL ? (
                      <p
                        className="icon-query-collapse"
                        onClick={() => setExpandLayout(LAYOUT_QUERY.HALF)}
                      />
                    ) : expandLayout === LAYOUT_QUERY.HALF ? (
                      <p
                        className="icon-query-collapse"
                        onClick={() => setExpandLayout(LAYOUT_QUERY.HIDDEN)}
                      />
                    ) : (
                      <p
                        className="icon-query-expand"
                        onClick={() => setExpandLayout(LAYOUT_QUERY.FULL)}
                      />
                    )}
                  </div>
                </Tooltip>
              </Box>
              <AceEditor
                className={`custom-editor ${
                  expandLayout === LAYOUT_QUERY.FULL
                    ? 'full-editor'
                    : expandLayout === LAYOUT_QUERY.HALF
                    ? ''
                    : 'hidden-editor'
                }`}
                ref={editorRef}
                mode="sql"
                theme="monokai"
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
            </Box>
            {queryId && !!queryValue && (
              <div
                className={`add-chart ${
                  expandLayout === LAYOUT_QUERY.HIDDEN
                    ? 'expand-chart'
                    : expandLayout === LAYOUT_QUERY.HALF
                    ? ''
                    : 'hidden-editor'
                }`}
              >
                {isLoadingResult ? (
                  <AppLoadingTable
                    widthColumns={[100]}
                    className="visual-table"
                  />
                ) : !!queryResult.length ? (
                  <Box>
                    <VisualizationDisplay
                      queryResult={queryResult}
                      queryValue={queryValue}
                      onReload={fetchQuery}
                      expandLayout={expandLayout}
                      onExpand={setExpandLayout}
                    />
                  </Box>
                ) : (
                  <Flex
                    className="empty-table"
                    justifyContent={'center'}
                    alignItems="center"
                  >
                    {errorExecuteQuery?.message
                      ? errorExecuteQuery?.message
                      : 'No data...'}
                  </Flex>
                )}
              </div>
            )}
          </Box>
        </div>
      </EditorContext.Provider>
    </div>
  );
};

export default QueryPart;
