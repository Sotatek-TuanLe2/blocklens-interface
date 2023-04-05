import { BasePage } from '../../layouts';
import { Box, Flex } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import AppButton from '../../components/AppButton';
import React, { useRef, useState } from 'react';
import { EditorContext } from './context/EditorContext';
import EditorSidebar from './part/EditorSidebar';
import VisualizationDisplay from './part/VisualizationDisplay';
import DashboardsRequest from '../../requests/DashboardsRequest';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import { getErrorMessage } from '../../utils/utils-helper';

const QueriesPage: React.FC = () => {
  const editorRef = useRef<any>();

  const [queryValues, setQueryValues] = useState<unknown[]>([]);
  const submitQuery = async () => {
    try {
      const dashboardsRequest = new DashboardsRequest();
      const queryValues = await dashboardsRequest.getQueriesValues();
      setQueryValues(queryValues);
    } catch (err) {
      getErrorMessage(err);
    }
  };

  return (
    <BasePage>
      <EditorContext.Provider
        value={{
          editor: editorRef,
          queryValues: queryValues,
        }}
      >
        <Flex justifyContent={'space-between'} alignItems={'flex-start'}>
          <EditorSidebar />
          <Flex flexDir={'column'} maxW={'100%'} overflow={'scroll'} w={'100%'}>
            <Box width={'100%'}>
              <AceEditor
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
              <Box mt={2}>
                <AppButton onClick={submitQuery}>Run</AppButton>
                <AppButton ml={2}>Format</AppButton>
              </Box>
            </Box>
            <Box mt={8}>
              <VisualizationDisplay queryValues={queryValues} />
            </Box>
          </Flex>
        </Flex>
      </EditorContext.Provider>
    </BasePage>
  );
};

export default QueriesPage;
