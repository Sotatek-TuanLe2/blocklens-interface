import { Box, Flex, Text, Tooltip } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import { AppButton, AppLoadingTable } from 'src/components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContext } from '../context/EditorContext';
import VisualizationDisplay from './VisualizationDisplay';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import { getErrorMessage } from 'src/utils/utils-helper';
import { useHistory, useParams, Prompt } from 'react-router-dom';
import {
  QueryExecutedResponse,
  IQuery,
  IErrorExecuteQuery,
} from 'src/utils/query.type';
import 'src/styles/pages/QueriesPage.scss';
import { AddParameterIcon, ExplandIcon } from 'src/assets/icons';
import { MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';
import ModalSaveQuery from 'src/modals/querySQL/ModalSaveQuery';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import useUser from 'src/hooks/useUser';
import { debounce } from 'lodash';
import { QUERY_RESULT_STATUS, ROUTES } from 'src/utils/common';
import { Query } from 'src/utils/utils-query';
import Header from './Header';
import { WORKSPACE_TYPES } from '..';

const QueryPart: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();

  const DEBOUNCE_TIME = 500;
  const editorRef = useRef<any>();

  const [queryResult, setQueryResult] = useState<any>([]);
  const [queryValue, setQueryValue] = useState<IQuery | null>(null);
  const [isSetting, setIsSetting] = useState<boolean>(false);
  const [switchTheme, setSwitchTheme] = useState<boolean>(false);
  const [expandEditor, setExpandEditor] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
  const [errorExecuteQuery, setErrorExecuteQuery] =
    useState<IErrorExecuteQuery>();
  const [selectedQuery, setSelectedQuery] = useState<string>('');

  const fetchQueryResultInterval = useRef<any>(null);

  const history = useHistory();
  const { user } = useUser();

  const hoverBackgroundButton = switchTheme ? '#dadde0' : '#2a2c2f99';
  const backgroundButton = switchTheme ? '#e9ebee' : '#2a2c2f';
  const userName =
    `${user?.getFirstName() || ''}` + `${user?.getLastName() || ''}`;

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

  const createNewQuery = async (query: string) => {
    try {
      const queryValue: IQuery = await rf
        .getRequest('DashboardsRequest')
        .createNewQuery({
          name: ``,
          query,
        });
      await rf.getRequest('DashboardsRequest').executeQuery(queryValue.id);
      history.push(`${ROUTES.QUERY}/${queryValue.id}`);
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

  const saveNameQuery = async (name: string) => {
    try {
      await rf.getRequest('DashboardsRequest').updateQuery(
        {
          name: name,
          isTemp: false,
        },
        queryId,
      );
      await fetchQuery();
      setShowSaveModal(false);
      toastSuccess({ message: 'Save query successfully.' });
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
        .getQueryById({ queryId });
      setQueryValue(dataQuery);
      // set query into editor
      if (!editorRef.current) {
        return;
      }
      const position = editorRef.current.editor.getCursorPosition();
      const editorValue = editorRef.current.editor.getValue();
      editorRef.current.editor.setValue('');
      editorRef.current.editor.session.insert(
        position,
        editorValue || dataQuery?.query,
      );
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

  const onExpand = () => {
    setExpandEditor((pre) => !pre);
  };

  const onSetting = () => {
    setIsSetting((pre) => !pre);
  };

  const onAddParameter = (parameter: string) => {
    const position = editorRef.current.editor.getCursorPosition();
    editorRef.current.editor.session.insert(position, parameter);
    editorRef.current.editor.focus();
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

  const _renderMenuPanelSetting = () => {
    return (
      <Flex
        flexDirection="column"
        className={`menu-panel ${switchTheme ? 'theme-light' : 'theme-dark'}`}
      >
        <Flex
          className={`menu-panel__item ${
            switchTheme ? 'theme-light' : 'theme-dark'
          }`}
          justifyContent="space-between"
          alignItems="center"
          onClick={() => setSwitchTheme((pre) => !pre)}
        >
          <Text fontSize="14px">Switch to light theme</Text>
          {switchTheme ? <MoonIcon /> : <SunIcon />}
        </Flex>
      </Flex>
    );
  };

  const _renderEditorButtons = () => {
    const colorIcon = switchTheme ? '#35373c' : '#fef5f7';

    return (
      <div className="custom-button">
        <Tooltip
          hasArrow
          placement="top"
          label={expandEditor ? 'Collapse' : 'Expand'}
        >
          <AppButton
            onClick={onExpand}
            bg={backgroundButton}
            _hover={{ bg: hoverBackgroundButton }}
          >
            <ExplandIcon color={colorIcon} />
          </AppButton>
        </Tooltip>
        <Tooltip hasArrow placement="top" label="Settings">
          <div className="btn-setting">
            <AppButton
              onClick={onSetting}
              bg={backgroundButton}
              _hover={{ bg: hoverBackgroundButton }}
            >
              <SettingsIcon color={colorIcon} />
            </AppButton>
            {isSetting && _renderMenuPanelSetting()}
          </div>
        </Tooltip>

        {!!queryClass && (
          <Tooltip hasArrow placement="top" label="Add Parameter">
            <AppButton
              onClick={() => onAddParameter('{{unnamed_parameter}}')}
              bg={backgroundButton}
              _hover={{ bg: hoverBackgroundButton }}
            >
              <AddParameterIcon color={colorIcon} />
            </AppButton>
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <div className="workspace-page__body__editor__query">
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
        {/* {!!queryClass && (
            <Flex
              className="queries-page-header-buttons"
              justifyContent={'space-between'}
            >
              {queryClass.getName() ? (
                <Flex gap={2}>
                  <Avatar name={user?.getFirstName()} size="sm" />
                  <div>
                    <div className="query-name">
                      @{userName} / {queryClass.getName() || ''}
                    </div>
                  </div>
                </Flex>
              ) : (
                <AppButton
                  className="query-button"
                  onClick={() => setShowSaveModal(true)}
                >
                  Save
                </AppButton>
              )}
            </Flex>
          )} */}

        <div className="queries-page">
          <Box className="queries-page__right-side">
            <Box width={'100%'}>
              <Box bg={switchTheme ? '#fff' : '#101530'} className="header-tab">
                <div className="tag-name">
                  <p className="icon-query" />
                  Query
                </div>
                <Tooltip
                  label={expandEditor ? 'Minimize' : 'Maximum'}
                  hasArrow
                  placement="top"
                >
                  <div className="btn-expand" onClick={onExpand}>
                    <p className="icon-query-expand" />
                  </div>
                </Tooltip>
              </Box>
              <AceEditor
                className={`custom-editor ${expandEditor ? 'expand' : ''}`}
                ref={editorRef}
                // annotations={[
                //   {
                //     row: 0,
                //     column: 0,
                //     type: 'error',
                //     text: errorExecuteQuery?.message || '',
                //   },
                // ]}
                mode="sql"
                theme={switchTheme ? 'kuroir' : 'monokai'}
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
              {/* <Box
                bg={switchTheme ? '#f3f5f7' : '#101530'}
                className="control-editor"
              >
                {_renderEditorButtons()}
                <AppButton
                  onClick={onRunQuery}
                  bg={backgroundButton}
                  _hover={{ bg: hoverBackgroundButton }}
                >
                  <Text color={switchTheme ? '#1d1d20' : '#f3f5f7'}>
                    {selectedQuery ? 'Run selection' : 'Run'}
                  </Text>
                </AppButton>
              </Box> */}
              <Box
                mt={1}
                bg={switchTheme ? '#f3f5f7' : '#101530'}
                className="add-chart"
              >
                {/* <AppButton variant="no-effects">
                  <Box className="icon-plus-circle" mr={2} /> Add Chart
                </AppButton>
                <div className="btn-expand" onClick={onExpand}>
                  <ExpandIcon />
                </div> */}
                <>
                  {isLoadingResult ? (
                    <AppLoadingTable
                      widthColumns={[100]}
                      className="visual-table"
                    />
                  ) : (
                    queryId &&
                    !!queryValue &&
                    (!!queryResult.length ? (
                      <Box>
                        <VisualizationDisplay
                          queryResult={queryResult}
                          queryValue={queryValue}
                          onReload={fetchQuery}
                          expandEditor={expandEditor}
                          onExpand={setExpandEditor}
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
                    ))
                  )}
                </>
              </Box>
            </Box>
          </Box>
        </div>
      </EditorContext.Provider>
      <ModalSaveQuery
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSubmit={saveNameQuery}
      />
      <Prompt
        when={!!queryClass && !queryClass.getName()}
        message="This query has not been saved yet. Discard unsaved changes?"
      />
    </div>
  );
};

export default QueryPart;
