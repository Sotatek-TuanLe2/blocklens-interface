import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

export const globalStyles = {
  colors: {
    // main: {
    //   100: 'linear-gradient(268.85deg, #226CFF 22.48%, #1084FF 83.59%)',
    // },
    // paragraph: {
    //   100: '#8D91A5',
    // },
    // line: {
    //   100: '#465065',
    // },
    // bg: {
    //   100: '#000224',
    //   200: '#1A203B',
    // },
    // pressed: {
    //   100: '#0245C9',
    // },
    // border: {
    //   100: '#272D52',
    // },
    // yellow: {
    //   100: '#FFB547',
    // },

    // brand: {
    //   100: '#E9E3FF',
    //   200: '#422AFB',
    //   300: '#422AFB',
    //   400: '#7551FF',
    //   500: '#422AFB',
    //   600: '#3311DB',
    //   700: '#02044A',
    //   800: '#190793',
    //   900: '#11047A',
    // },
    // brandScheme: {
    //   100: '#E9E3FF',
    //   200: '#7551FF',
    //   300: '#7551FF',
    //   400: '#7551FF',
    //   500: '#422AFB',
    //   600: '#3311DB',
    //   700: '#02044A',
    //   800: '#190793',
    //   900: '#02044A',
    // },
    // brandTabs: {
    //   100: '#E9E3FF',
    //   200: '#422AFB',
    //   300: '#422AFB',
    //   400: '#422AFB',
    //   500: '#422AFB',
    //   600: '#3311DB',
    //   700: '#02044A',
    //   800: '#190793',
    //   900: '#02044A',
    // },
    // secondaryGray: {
    //   100: '#E0E5F2',
    //   200: '#E1E9F8',
    //   300: '#F4F7FE',
    //   400: '#E9EDF7',
    //   500: '#8F9BBA',
    //   600: '#A3AED0',
    //   700: '#707EAE',
    //   800: '#707EAE',
    //   900: '#1B2559',
    // },
    // red: {
    //   100: '#EE5D50',
    // },
    // blue: {
    //   50: '#EFF4FB',
    //   100: '#4C84FF',
    //   200: '#2E5BFF',
    //   500: '#3965FF',
    // },
    // orange: {
    //   100: '#FFF6DA',
    //   500: '#FFB547',
    // },
    // green: {
    //   100: '#28C76F',
    // },
    // navy: {
    //   50: '#d0dcfb',
    //   100: '#aac0fe',
    //   200: '#a3b9f8',
    //   300: '#728fea',
    //   400: '#3652ba',
    //   500: '#1b3bbb',
    //   600: '#24388a',
    //   700: '#1B254B',
    //   800: '#111c44',
    //   900: '#0b1437',
    // },
    // gray: {
    //   100: '#FAFCFE',
    // },
    // white: {
    //   100: '#FFFFFF',
    // },
    // card: {
    //   100: '#101530',
    // },
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
      body: {
        bg: props.colorMode === 'dark' ? '#000224' : 'bgLight',
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
};
