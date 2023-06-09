import { extendTheme } from '@chakra-ui/react';
import { StyleFunctionProps } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    bgLight: '#F4F6F9',
    bgDark: '#000224',
    white: '#FFFFFF',
    bg2: '#1a203b',
    lightTag: 'rgba(0, 2, 36, 0.05);',
    gradient: 'linear-gradient(271.63deg, #1E72FF -2.92%, #0250BE 102.1%)',
    $disable: '#242b45',
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      'html, body': {
        background: props.colorMode === 'dark' ? 'bgDark' : 'bgLight',
      },
      '.btn-primary': { background: 'gradient', color: 'white' },
      span: {
        color: props.colorMode === 'dark' ? '' : '#000224',
      },
      '.theme-text': {
        color: props.colorMode === 'dark' ? 'white' : '#000224',
      },
      '.theme-border': {
        boxShadow:
          props.colorMode === 'dark'
            ? ''
            : ' 0px 15px 30px rgba(0, 0, 0, 0.04)',
        border: props.colorMode === 'dark' ? '1px solid #272d52' : '',
      },

      '.theme-background': {
        background: props.colorMode === 'dark' ? 'bgDark' : 'white',
      },
      '.theme-background-item': {
        background: props.colorMode === 'dark' ? 'bg2' : 'lightTag',
      },
      '.tag': {
        div: {
          background: props.colorMode === 'dark' ? 'bg2' : 'lightTag',
          color: props.colorMode === 'dark' ? 'white' : 'rgba(0, 2, 36, 0.5)',
        },
      },
      '.dashboards-page ': {
        '.dashboard-list__item--column': {
          background: props.colorMode === 'dark' ? '#101530' : 'white',
        },
        '.dashboard-list__item--column__content__title ': {
          borderBottom:
            props.colorMode === 'dark'
              ? '1px solid #242b45'
              : '1px solid rgba(0, 2, 36, 0.1)',
        },
      },
    }),
  },
});

export default theme;
