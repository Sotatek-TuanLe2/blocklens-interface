import { BasePage } from '../../layouts';
import { Box, Flex, Text, Tooltip } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import AppButton from '../../components/AppButton';
import React, { useEffect, useRef, useState } from 'react';
import { EditorContext } from './context/EditorContext';
import EditorSidebar from './part/EditorSidebar';
import VisualizationDisplay from './part/VisualizationDisplay';
import DashboardsRequest from '../../requests/DashboardsRequest';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import { getErrorMessage } from '../../utils/utils-helper';
import { useHistory, useParams } from 'react-router-dom';
import {
  QueryExecutedResponse,
  QueryInfoResponse,
  QueryType,
  QueryResultResponse,
} from '../../utils/query.type';
import 'src/styles/pages/QueriesPage.scss';
import { AddParameterIcon, ExplandIcon } from 'src/assets/icons';
import { MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';
import ModalSaveQuery from 'src/modals/ModalSaveQuery';
import { toastSuccess } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';

interface ParamTypes {
  queryId: string;
}

const QueriesPage = () => {
  const editorRef = useRef<any>();
  const executionIdRef = useRef<string>('');
  const fetchQueryRef = useRef<any>();
  const { queryId } = useParams<ParamTypes>();

  const [queryResult, setQueryResult] = useState<any>([]);
  const [infoQuery, setInfoQuery] = useState<any | null>(null);
  const [isSetting, setIsSetting] = useState<boolean>(false);

  const [showButton, setShowButton] = useState<boolean>(false);
  const [switchTheme, setSwitchTheme] = useState<boolean>(false);
  const [expandEditor, setExpandEditor] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  const history = useHistory();

  const hoverBackgroundButton = switchTheme ? '#dadde0' : '#2a2c2f99';
  const backgroundButton = switchTheme ? '#e9ebee' : '#2a2c2f';

  useEffect(() => {
    if (queryId) {
      if (!executionIdRef.current) {
        fetchDataOnReload();
      } else {
        fetchQueryResult(executionIdRef.current);
        fetchFindQuery();
      }
    }
  }, [queryId]);

  const createNewQuery = async (query: string) => {
    try {
      if (queryId) {
        const updateQuery = {
          query: query,
        };
        await rf
          .getRequest('DashboardsRequest')
          .updateQuery(updateQuery, queryId);
        const queryValues: QueryExecutedResponse = await rf
          .getRequest('DashboardsRequest')
          .executeQuery(queryId);
        executionIdRef.current = queryValues.id;
        await fetchQueryResult(queryValues.id);
        await fetchFindQuery();
      } else {
        const newQuery: QueryType = {
          name: ``,
          query: query,
        };
        const infoQuery: QueryInfoResponse = await rf
          .getRequest('DashboardsRequest')
          .createNewQuery(newQuery);
        const queryValues: QueryExecutedResponse = await rf
          .getRequest('DashboardsRequest')
          .executeQuery(infoQuery.id);
        executionIdRef.current = queryValues.id;
        history.push(`/queries/${infoQuery.id}`);
      }
    } catch (err) {
      getErrorMessage(err);
    }
  };

  const saveNameQuery = async (name: string) => {
    const newQuery = {
      name: name,
      is_tempt: false,
    };
    try {
      await rf.getRequest('DashboardsRequest').updateQuery(newQuery, queryId);
      setShowSaveModal(false);
      toastSuccess({ message: 'Save query is successfully.' });
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const submitQuery = async () => {
    setShowButton(true);
    try {
      await createNewQuery(editorRef.current.editor.getValue());
    } catch (err) {
      getErrorMessage(err);
    }
  };

  const fetchQueryResult = async (executionId: string) => {
    fetchQueryRef.current = setInterval(async () => {
      try {
        const res = await rf.getRequest('DashboardsRequest').getQueryResult({
          queryId,
          executionId,
        });

        setQueryResult(() => res);
        if (res.status === 'DONE') clearInterval(fetchQueryRef.current);
      } catch (err) {
        getErrorMessage(err);
      }
    }, 2000);
  };

  const fetchFindQuery = async () => {
    let data;
    try {
      const dataQuery = await rf
        .getRequest('DashboardsRequest')
        .getQueryById({ queryId });
      setInfoQuery(dataQuery);
      data = dataQuery;
    } catch (error) {
      getErrorMessage(error);
    }
    return data;
  };

  const fetchDataOnReload = async () => {
    try {
      const res: QueryResultResponse = await rf
        .getRequest('DashboardsRequest')
        .getQueryExecutionId({
          queryId,
        });
      await fetchQueryResult(res.resultId);
      const data = await fetchFindQuery();
      const position = editorRef.current.editor.getCursorPosition();
      editorRef.current.editor.session.insert(position, data?.query);
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

  const onAddParameter = () => {
    const position = editorRef.current.editor.getCursorPosition();
    editorRef.current.editor.session.insert(position, '{{unnamed_parameter}}');
  };

  // const onClickFullScreen = () => {
  //   if (editorRef.current.editor) editorRef.current.editor.resize();
  // };

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
        {showButton && (
          <Tooltip hasArrow placement="top" label="Add Parameter">
            <AppButton
              onClick={onAddParameter}
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
          <div className="queries-page">
            <EditorSidebar />
            <Box className="queries-page__right-side">
              <Flex justifyContent={'right'}>
                {infoQuery && !infoQuery?.name && (
                  <AppButton onClick={() => setShowSaveModal(true)}>
                    Save
                  </AppButton>
                )}
              </Flex>
              <Box width={'100%'}>
                <Box bg={switchTheme ? '#fff' : '#272822'} h="10px"></Box>
                <AceEditor
                  className={`custom-editor ${expandEditor ? 'expland' : ''}`}
                  ref={editorRef}
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
                    onClick={submitQuery}
                    bg={backgroundButton}
                    _hover={{ bg: hoverBackgroundButton }}
                  >
                    <Text color={switchTheme ? '#1d1d20' : '#f3f5f7'}>Run</Text>
                  </AppButton>
                </Box>
              </Box>
              <Box mt={8}>
                {infoQuery && queryResult.length && (
                  <VisualizationDisplay
                    queryResult={queryResult}
                    queryValue={infoQuery}
                    onReload={fetchFindQuery}
                  />
                )}
              </Box>
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
