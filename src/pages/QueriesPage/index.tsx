import { BasePage } from '../../layouts';
import { Box, Flex } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import AppButton from '../../components/AppButton';
import React, { useRef } from 'react';
import { EditorContext } from './context/EditorContext';
import EditorSidebar from './part/EditorSidebar';
import VisualizationDisplay from './part/VisualizationDisplay';

const QueriesPage: React.FC = () => {
  const editorRef = useRef<any>();

  const submitQuery = () => {
    console.log(editorRef.current.editor.getValue());
  };

  return (
    <BasePage>
      <EditorContext.Provider
        value={{
          editor: editorRef,
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
              <VisualizationDisplay />
            </Box>
          </Flex>
        </Flex>
      </EditorContext.Provider>
    </BasePage>
  );
};

export default QueriesPage;
