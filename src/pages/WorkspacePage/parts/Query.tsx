import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { useParams } from 'react-router-dom';
import { AppLoadingTable, AppTag } from 'src/components';
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
import useUser from 'src/hooks/useUser';
import { TYPE_OF_MODAL, QUERY_RESULT_STATUS } from 'src/utils/common';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { EditorContext } from '../context/EditorContext';
import Header from './Header';
import VisualizationDisplay from './VisualizationDisplay';
import AppNetworkIcons from 'src/components/AppNetworkIcons';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { BROADCAST_FETCH_WORKPLACE_DATA } from './Sidebar';
import ModalQuery from 'src/modals/querySQL/ModalQuery';
import { Query } from 'src/utils/utils-query';

export const BROADCAST_ADD_TEXT_TO_EDITOR = 'ADD_TEXT_TO_EDITOR';
export const BROADCAST_FETCH_QUERY = 'FETCH_QUERY';

const QueryPart: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();

  const DEBOUNCE_TIME = 500;
  const editorRef = useRef<any>();
  const [queryResult, setQueryResult] = useState<any>([]);
  const [queryValue, setQueryValue] = useState<IQuery | null>(null);
  const [expandLayout, setExpandLayout] = useState<string>(LAYOUT_QUERY.HALF);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
  const [errorExecuteQuery, setErrorExecuteQuery] =
    useState<IErrorExecuteQuery | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<string>('');
  const fetchQueryResultInterval = useRef<any>(null);
  const [openModalSettingQuery, setOpenModalSettingQuery] =
    useState<boolean>(false);

  const { user } = useUser();

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
      if (!queryClass?.getVisualizations().length) {
        await rf.getRequest('DashboardsRequest').insertVisualization({
          name: 'Query results',
          type: 'table',
          options: {},
          queryId: queryId,
        });
      }
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
    setExpandLayout((prevState) => {
      if (prevState === LAYOUT_QUERY.FULL) {
        return LAYOUT_QUERY.HALF;
      }
      if (prevState === LAYOUT_QUERY.HALF) {
        return LAYOUT_QUERY.HIDDEN;
      }
      return LAYOUT_QUERY.FULL;
    });
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
      >
        {errorExecuteQuery?.message || 'No data...'}
      </Flex>
    );
  };

  const _renderVisualizations = () => {
    if (!queryId || !queryValue) {
      return null;
    }

    return (
      <div
        className={` 
        ${expandLayout === LAYOUT_QUERY.FULL ? 'add-chart-full' : 'add-chart'}
         ${
           expandLayout === LAYOUT_QUERY.HIDDEN
             ? 'expand-chart hidden-editor'
             : ''
         } `}
      >
        {_renderContent()}
      </div>
    );
  };

  return (
    <div className="workspace-page__editor__query">
      <Header
        type={LIST_ITEM_TYPE.QUERIES}
        author={user?.getFirstName() || ''}
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
              <Box className="header-tab">
                <div className="header-tab__info">
                  {queryClass?.getChains() && (
                    <AppNetworkIcons networkIds={queryClass?.getChains()} />
                  )}
                  <div className="header-tab__info tag">
                    {['defi', 'gas', 'dex'].map((item) => (
                      <AppTag key={item} value={item} />
                    ))}
                  </div>
                </div>
                <Tooltip
                  label={
                    expandLayout === LAYOUT_QUERY.HIDDEN
                      ? 'Maximize'
                      : 'Minimize'
                  }
                  hasArrow
                  placement="top"
                >
                  <div className="btn-expand">
                    <p
                      className="icon-query-collapse"
                      onClick={onExpandEditor}
                    />
                  </div>
                </Tooltip>
              </Box>
              <AceEditor
                className={`custom-editor ${
                  expandLayout === LAYOUT_QUERY.FULL
                    ? 'custom-editor--full'
                    : ''
                } ${
                  expandLayout === LAYOUT_QUERY.HIDDEN
                    ? 'custom-editor--hidden'
                    : ''
                }`}
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
