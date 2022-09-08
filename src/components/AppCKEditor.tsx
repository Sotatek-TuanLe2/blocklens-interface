import React, { FC, useEffect, useRef, useState } from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

interface AppCKEditorProps {
  onChange: (data: unknown) => void;
  name?: string;
  value?: string;
  disabled?: boolean;
}

const AppCKEditor: FC<AppCKEditorProps> = ({
  onChange,
  name,
  value,
  disabled,
}) => {
  const editorRef = useRef<any>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      /* eslint @typescript-eslint/no-var-requires: "off" */
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
  }, [editorRef]);

  return (
    <Box
      w={'full'}
      style={{
        ['--ck-color-base-background' as string]: 'transparent',
        ['--ck-color-toolbar-background' as string]: 'transparent',
        ['--ck-color-text' as string]: useColorModeValue(
          'gray.800',
          'whiteAlpha.900',
        ),
        ['--ck-focus-ring' as string]: 'inherit',
      }}
    >
      {editorLoaded ? (
        <CKEditor
          name={name}
          editor={ClassicEditor}
          data={value}
          disabled={disabled}
          onChange={(event: any, editor: { getData: () => any }) => {
            const data = editor.getData();
            onChange(data);
          }}
        />
      ) : (
        <Text>Editor loading</Text>
      )}
    </Box>
  );
};

export default AppCKEditor;
