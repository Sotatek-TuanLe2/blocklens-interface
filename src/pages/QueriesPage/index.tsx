import { BasePage } from '../../layouts';
import { Box, Flex, Text, Tooltip } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import AppButton from '../../components/AppButton';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContext } from './context/EditorContext';
import EditorSidebar from './part/EditorSidebar';
import VisualizationDisplay from './part/VisualizationDisplay';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import { getErrorMessage } from '../../utils/utils-helper';
import { useHistory, useParams } from 'react-router-dom';
import {
  QueryExecutedResponse,
  IQuery,
  QueryResultResponse,
} from '../../utils/query.type';
import 'src/styles/pages/QueriesPage.scss';
import { AddParameterIcon, ExplandIcon } from 'src/assets/icons';
import { MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';
import ModalSaveQuery from 'src/modals/ModalSaveQuery';
import { toastSuccess } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import { AppLoadingTable } from 'src/components';

interface ParamTypes {
  queryId: string;
}

interface IErrorExecuteQuery {
  message: string;
  name: string;
  metadata: { position: string; code: string };
}

const QueriesPage = () => {
  const editorRef = useRef<any>();
  const { queryId } = useParams<ParamTypes>();

  const [queryResult, setQueryResult] = useState<any>([]);
  const [queryValue, setInfoQuery] = useState<IQuery | null>(null);
  const [isSetting, setIsSetting] = useState<boolean>(false);
  const [switchTheme, setSwitchTheme] = useState<boolean>(false);
  const [expandEditor, setExpandEditor] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(!!queryId);
  const [errorExecuteQuery, setErrorExecuteQuery] =
    useState<IErrorExecuteQuery>();

  const history = useHistory();

  const hoverBackgroundButton = switchTheme ? '#dadde0' : '#2a2c2f99';
  const backgroundButton = switchTheme ? '#e9ebee' : '#2a2c2f';

  useEffect(() => {
    if (queryId) {
      fetchInitalData();
    }
  }, [queryId]);

  const createNewQuery = async (query: string) => {
    try {
      const queryValue: IQuery = await rf
        .getRequest('DashboardsRequest')
        .createNewQuery({
          name: ``,
          query,
        });
      await rf.getRequest('DashboardsRequest').executeQuery(queryValue.id);
      history.push(`/queries/${queryValue.id}`);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const updateQuery = async (query: string) => {
    try {
      await rf.getRequest('DashboardsRequest').updateQuery({ query }, queryId);
      const queryValues: QueryExecutedResponse = await rf
        .getRequest('DashboardsRequest')
        .executeQuery(queryId);
      await fetchQueryResult(queryValues.id);
      await fetchQuery();
    } catch (error) {
      getErrorMessage(error);
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
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const fetchQueryResult = async (executionId: string) => {
    setIsLoadingResult(true);
    const res = await rf.getRequest('DashboardsRequest').getQueryResult({
      queryId,
      executionId,
    });
    let fetchQueryResultInterval: any = null;
    if (res.status !== 'DONE' && res.status !== 'FAILED') {
      fetchQueryResultInterval = setInterval(async () => {
        const resInterval = await rf
          .getRequest('DashboardsRequest')
          .getQueryResult({
            queryId,
            executionId,
          });
        if (resInterval.status === 'DONE' || resInterval.status === 'FAILED') {
          setQueryResult(resInterval.result);
          if (resInterval?.error) {
            setErrorExecuteQuery(resInterval?.error);
          }
          setIsLoadingResult(false);
          clearInterval(fetchQueryResultInterval);
        }
      }, 2000);
    } else {
      setIsLoadingResult(false);
      setQueryResult(res.result);
      setErrorExecuteQuery(res?.error);
    }
  };

  const fetchQuery = async () => {
    try {
      const dataQuery = await rf
        .getRequest('DashboardsRequest')
        .getQueryById({ queryId });
      setInfoQuery(dataQuery);
      // set query into editor
      const position = editorRef.current.editor.getCursorPosition();
      editorRef.current.editor.setValue('');
      editorRef.current.editor.session.insert(position, dataQuery?.query);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const fetchInitalData = async () => {
    try {
      const res: QueryResultResponse = await rf
        .getRequest('DashboardsRequest')
        .getQueryExecutionId({
          queryId,
        });
      await fetchQuery();
      await fetchQueryResult(res.resultId);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const onExpland = () => {
    setExpandEditor((pre) => !pre);
  };

  const onSetting = () => {
    setIsSetting((pre) => !pre);
  };

  const onAddParameter = (parameter: string) => {
    const position = editorRef.current.editor.getCursorPosition();
    editorRef.current.editor.focus();
    editorRef.current.editor.session.insert(position, parameter);
  };

  const onRunQuery = async () => {
    try {
      if (queryId) {
        await updateQuery(editorRef.current.editor.getValue());
      } else {
        await createNewQuery(editorRef.current.editor.getValue());
      }
    } catch (err) {
      getErrorMessage(err);
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
            onClick={onExpland}
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
        {/* <Tooltip hasArrow placement="top" label="Format query">
          <AppButton
            onClick={onFormat}
            bg={backgroundButton}
            _hover={{ bg: hoverBackgroundButton }}
          >
            <FormatIcon color={colorIcon} />
          </AppButton>
        </Tooltip> */}
        {queryValue && (
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
    <BasePage>
      <>
        <EditorContext.Provider
          value={{
            editor: editorRef,
            queryResult: queryResult,
          }}
        >
          <Flex
            className="queries-page-header-buttons"
            justifyContent={'right'}
          >
            {queryValue && !queryValue?.name && (
              <AppButton onClick={() => setShowSaveModal(true)}>Save</AppButton>
            )}
          </Flex>
          <div className="queries-page">
            <EditorSidebar
              onAddParameter={onAddParameter}
              queryValue={queryValue}
            />
            <Box className="queries-page__right-side">
              <Box width={'100%'}>
                <Box bg={switchTheme ? '#fff' : '#272822'} h="10px"></Box>
                <AceEditor
                  className={`custom-editor ${expandEditor ? 'expland' : ''}`}
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
                />
                <Box
                  bg={switchTheme ? '#f3f5f7' : '#111213'}
                  className="control-editor"
                >
                  {_renderEditorButtons()}
                  <AppButton
                    onClick={onRunQuery}
                    bg={backgroundButton}
                    _hover={{ bg: hoverBackgroundButton }}
                  >
                    <Text color={switchTheme ? '#1d1d20' : '#f3f5f7'}>Run</Text>
                  </AppButton>
                </Box>
              </Box>
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
                    <Box mt={8}>
                      <VisualizationDisplay
                        queryResult={queryResult}
                        queryValue={queryValue}
                        onReload={fetchQuery}
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
          </div>
        </EditorContext.Provider>
        <ModalSaveQuery
          open={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSubmit={saveNameQuery}
        />
      </>
    </BasePage>
  );
};

export default QueriesPage;
