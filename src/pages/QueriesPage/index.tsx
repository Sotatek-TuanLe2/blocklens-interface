import { BasePage } from '../../layouts';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import AppButton from '../../components/AppButton';
import React, { useEffect, useRef, useState } from 'react';
import { EditorContext } from './context/EditorContext';
import EditorSidebar from './part/EditorSidebar';
import VisualizationDisplay from './part/VisualizationDisplay';
import DashboardsRequest from '../../requests/DashboardsRequest';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import { getErrorMessage } from '../../utils/utils-helper';
import { QueryType } from '../../utils/common';
import { useParams } from 'react-router-dom';
import 'src/styles/pages/QueriesPage.scss';
import { ExplandIcon, FormatIcon } from 'src/assets/icons';
import { SettingsIcon } from '@chakra-ui/icons';

interface ParamTypes {
  queryId: string;
}

const QueriesPage = () => {
  const editorRef = useRef<any>();
  const { queryId } = useParams<ParamTypes>();

  const [queryValues, setQueryValues] = useState<unknown[]>([]);
  const [infoQuery, setInfoQuery] = useState<QueryType | null>(null);
  const [isExpand, setIsExpand] = useState<boolean>(false);

  const createNewQuery = async (query: string) => {
    try {
      const dashboardsRequest = new DashboardsRequest();
      const randomId = Math.floor(Math.random() * 10000000).toString();
      const newQuery: QueryType = {
        id: randomId,
        name: `Query-${randomId}`,
        query: 'select * from arbitrum.blocks limit 10',
        visualizations: [
          {
            name: 'Table',
            type: 'table',
            id: '1',
            options: {},
          },
        ],
      };
      const infoQuery = await dashboardsRequest.createNewQuery(newQuery);
      setInfoQuery(infoQuery);
    } catch (err) {
      getErrorMessage(err);
    }
  };

  const submitQuery = async () => {
    try {
      const dashboardsRequest = new DashboardsRequest();
      const queryValues = await dashboardsRequest.getQueriesValues();
      await createNewQuery(editorRef.current.editor.getValue());
      setQueryValues(queryValues);
    } catch (err) {
      getErrorMessage(err);
    }
  };

  const fetchQueryResults = async () => {
    try {
      const dashboardsRequest = new DashboardsRequest();
      const queryValues = await dashboardsRequest.getQueriesValues();
      setQueryValues(queryValues);
    } catch (err) {
      getErrorMessage(err);
    }
  };

  const fetchInfoQuery = async () => {
    try {
      const request = new DashboardsRequest();
      const res = await request.getQuery(queryId);
      const position = editorRef.current.editor.getCursorPosition();
      editorRef.current.editor.session.insert(position, res.query);
      setInfoQuery(res);
    } catch (err) {
      getErrorMessage(err);
    }
  };

  const onFormat = () => {
    // const editor = editorRef.current.editor;
    // console.log('editor', editor);
    // return editor.format;
  };

  const onExpland = () => {
    setIsExpand((pre) => !pre);
  };

  useEffect(() => {
    if (queryId) {
      fetchQueryResults();
      fetchInfoQuery();
    }
  }, [queryId]);

  const _renderButton = () => {
    return (
      <div className="custom-button">
        <Tooltip
          hasArrow
          placement="top"
          label={isExpand ? 'Collapse' : 'Expand'}
        >
          <AppButton
            onClick={onExpland}
            bg={'#2a2c2f'}
            _hover={{ bg: '#2a2c2f99' }}
          >
            <ExplandIcon />
          </AppButton>
        </Tooltip>
        <Tooltip hasArrow placement="top" label="Settings">
          <AppButton
            onClick={onFormat}
            bg={'#2a2c2f'}
            _hover={{ bg: '#2a2c2f99' }}
          >
            <SettingsIcon />
          </AppButton>
        </Tooltip>
        <Tooltip hasArrow placement="top" label="Format query">
          <AppButton
            onClick={onFormat}
            bg={'#2a2c2f'}
            _hover={{ bg: '#2a2c2f99' }}
          >
            <FormatIcon />
          </AppButton>
        </Tooltip>
      </div>
    );
  };

  return (
    <BasePage>
      <EditorContext.Provider
        value={{
          editor: editorRef,
          queryValues: queryValues,
        }}
      >
        <div className="queries-page">
          <EditorSidebar />
          <Flex flexDir={'column'} maxW={'100%'} overflow={'auto'} w={'100%'}>
            <Box width={'100%'}>
              <Box bg="#272822" h="10px"></Box>
              <AceEditor
                className={`custom-editor ${isExpand ? 'expland' : ''}`}
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
              />
              <Box className="control-editor">
                {_renderButton()}
                <AppButton
                  onClick={submitQuery}
                  bg={'#2a2c2f'}
                  _hover={{ bg: '#2a2c2f99' }}
                >
                  Run
                </AppButton>
              </Box>
            </Box>
            <Box mt={8}>
              {infoQuery && (
                <VisualizationDisplay
                  queryValues={queryValues}
                  queryInfo={infoQuery}
                />
              )}
            </Box>
          </Flex>
        </div>
      </EditorContext.Provider>
    </BasePage>
  );
};

export default QueriesPage;
