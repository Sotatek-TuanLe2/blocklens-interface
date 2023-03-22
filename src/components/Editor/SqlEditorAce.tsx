import React, { useRef } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-sql';
import AppButton from '../AppButton';
import { Box, Flex } from '@chakra-ui/react';
import EditorSidebar from './EditorSidebar';
import { EditorContext } from './EditorContext';
import { BasePage } from '../../layouts';

const SqlEditor = () => {
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
        </Flex>
      </EditorContext.Provider>
    </BasePage>
  );
};

export default SqlEditor;
