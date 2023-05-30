import { Box, Flex, Tooltip } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import { AppLoadingTable, AppTag } from 'src/components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import VisualizationDisplay from 'src/pages/WorkspacePage/parts/VisualizationDisplay';
import 'ace-builds/src-noconflict/theme-monokai';
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
import { Query } from 'src/utils/utils-query';
import Header from 'src/pages/WorkspacePage/parts/Header';
import AppNetworkIcons from 'src/components/AppNetworkIcons';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';

const QueryPart: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();
  const editorRef = useRef<any>();

  const [queryResult, setQueryResult] = useState<any>([]);
  const [queryValue, setQueryValue] = useState<IQuery | null>(null);
  const [expandLayout, setExpandLayout] = useState<string>(LAYOUT_QUERY.HALF);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
  const [errorExecuteQuery, setErrorExecuteQuery] =
    useState<IErrorExecuteQuery>();

  const fetchQueryResultInterval = useRef<any>(null);

  useEffect(() => {
    if (queryId) {
      fetchInitalData();
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
      await fetchQueryResult();
      await fetchQuery();
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  return (
    <div className="workspace-page__editor__query">
      <Header
        type={LIST_ITEM_TYPE.QUERIES}
        author={''}
        data={queryValue}
        needAuthentication={false}
      />
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
              ) : errorExecuteQuery?.message ? (
                <Flex
                  className="empty-table"
                  justifyContent={'center'}
                  alignItems="center"
                >
                  {errorExecuteQuery?.message}
                </Flex>
              ) : (
                <Box>
                  <VisualizationDisplay
                    queryResult={queryResult}
                    queryValue={queryValue}
                    expandLayout={expandLayout}
                    needAuthentication={false}
                    onReload={fetchQuery}
                    onExpand={setExpandLayout}
                  />
                </Box>
              )}
            </div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default QueryPart;