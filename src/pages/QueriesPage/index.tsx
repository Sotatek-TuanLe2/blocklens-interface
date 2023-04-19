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
  IQuery,
  QueryResultResponse,
} from '../../utils/query.type';
import 'src/styles/pages/QueriesPage.scss';
import { AddParameterIcon, ExplandIcon } from 'src/assets/icons';
import { MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';
import moment from 'moment';
import ModalSaveQuery from 'src/modals/ModalSaveQuery';
import { toastSuccess } from 'src/utils/utils-notify';

interface ParamTypes {
  queryId: string;
}

const QueriesPage = () => {
  const editorRef = useRef<any>();
  const excutionIdRef = useRef<string>('');
  const { queryId } = useParams<ParamTypes>();

  const [queryResult, setQueryResult] = useState<any>([]);
  const [infoQuery, setInfoQuery] = useState<any | null>(null);
  const [isSetting, setIsSetting] = useState<boolean>(false);

  const [showButton, setShowButton] = useState<boolean>(false);
  const [switchTheme, setSwitchTheme] = useState<boolean>(false);
  const [isExpand, setIsExpand] = useState<boolean>(false);

  const [showSaveModal, setShowSaveModal] = useState(false);

  const history = useHistory();

  const createNewQuery = async (query: string) => {
    try {
      const dashboardsRequest = new DashboardsRequest();
      if (queryId) {
        const updateQuery = {
          query: query,
        };
        await dashboardsRequest.updateQueries(updateQuery, queryId);
        const queryValues: QueryExecutedResponse =
          await dashboardsRequest.postExcuteQuery(queryId);
        excutionIdRef.current = queryValues.id;
        await fetchQueryResult(queryValues.id);
        await fetchFindQuery();
      } else {
        const newQuery: QueryType = {
          name: ``,
          query: query,
        };

        const infoQuery: QueryInfoResponse =
          await dashboardsRequest.createNewQuery(newQuery);
        const queryValues: QueryExecutedResponse =
          await dashboardsRequest.postExcuteQuery(infoQuery.id);
        excutionIdRef.current = queryValues.id;
        history.push(`/queries/${infoQuery.id}`);
      }
      // const infoQuery = await dashboardsRequest.createNewQuery(newQuery);
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
      const dashboardsRequest = new DashboardsRequest();
      await dashboardsRequest.updateQueries(newQuery, queryId);
      setShowSaveModal(false);
      toastSuccess({ message: 'Save query is successfully.' });
    } catch (error) {
      getErrorMessage(error);
    }
  };

  // const updateQuery = async () => {

  // }

  const submitQuery = async () => {
    setShowButton(true);
    try {
      // const dashboardsRequest = new DashboardsRequest();
      // const queryValues = await dashboardsRequest.getQueriesValues();
      await createNewQuery(editorRef.current.editor.getValue());
      // setQueryValues(queryValues);
    } catch (err) {
      getErrorMessage(err);
    }
  };

  const fetchQueryRef = useRef<any>();
  const fetchQueryResult = async (executionId: string) => {
    fetchQueryRef.current = setInterval(async () => {
      try {
        const request = new DashboardsRequest();

        const res = await request.getQueryResult({
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
      const request = new DashboardsRequest();
      const dataQuery = await request.getDataQuery({ queryId });
      setInfoQuery(dataQuery);
      data = dataQuery;
    } catch (error) {
      getErrorMessage(error);
    }
    return data;
  };

  const fetchDataOnReload = async () => {
    try {
      const request = new DashboardsRequest();

      const res: QueryResultResponse = await request.getExecutionId({
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

  useEffect(() => {
    if (queryId) {
      if (!excutionIdRef.current) {
        fetchDataOnReload();
      } else {
        fetchQueryResult(excutionIdRef.current);
        fetchFindQuery();
      }
    }
  }, [queryId]);

  const onExpland = () => {
    setIsExpand((pre) => !pre);
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

  const hoverBackground = switchTheme ? '#dadde0' : '#2a2c2f99';
  const background = switchTheme ? '#e9ebee' : '#2a2c2f';

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

  const _renderButton = () => {
    const colorIcon = switchTheme ? '#35373c' : '#fef5f7';

    return (
      <div className="custom-button">
        <Tooltip
          hasArrow
          placement="top"
          label={isExpand ? 'Collapse' : 'Expand'}
        >
          <AppButton
            onClick={onExpland}
            bg={background}
            _hover={{ bg: hoverBackground }}
          >
            <ExplandIcon color={colorIcon} />
          </AppButton>
        </Tooltip>
        <Tooltip hasArrow placement="top" label="Settings">
          <div className="btn-setting">
            <AppButton
              onClick={onSetting}
              bg={background}
              _hover={{ bg: hoverBackground }}
            >
              <SettingsIcon color={colorIcon} />
            </AppButton>
            {isSetting && _renderMenuPanelSetting()}
          </div>
        </Tooltip>
        {/* <Tooltip hasArrow placement="top" label="Format query">
          <AppButton
            onClick={onFormat}
            bg={background}
            _hover={{ bg: hoverBackground }}
          >
            <FormatIcon color={colorIcon} />
          </AppButton>
        </Tooltip> */}
        {showButton && (
          <Tooltip hasArrow placement="top" label="Add Parameter">
            <AppButton
              onClick={onAddParameter}
              bg={background}
              _hover={{ bg: hoverBackground }}
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
                  className={`custom-editor ${isExpand ? 'expland' : ''}`}
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
                  {_renderButton()}
                  <AppButton
                    onClick={submitQuery}
                    bg={background}
                    _hover={{ bg: hoverBackground }}
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
                    onReload={async () => {
                      await fetchQueryResult(excutionIdRef.current);
                      await fetchFindQuery();
                    }}
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
