import { extendTheme } from '@chakra-ui/react';
import { StyleFunctionProps } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    bgLight: '#F4F6F9',
    bgDark: '#101530',
    white: '#FFFFFF',
    bg2: '#1a203b',
    lightTag: 'rgba(0, 2, 36, 0.05);',
    gradient: 'linear-gradient(271.63deg, #1E72FF -2.92%, #0250BE 102.1%)',
    $disable: '#242b45',
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      'html, body': {
        background: props.colorMode === 'dark' ? '#000224' : 'bgLight',
      },
    }),
  },
});

export default theme;
