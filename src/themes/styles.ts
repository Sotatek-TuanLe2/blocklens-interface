import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

export const globalStyles = {
  colors: {
    main: {
      100: 'linear-gradient(268.85deg, #226CFF 22.48%, #1084FF 83.59%)',
      200: 'linear-gradient(271.63deg, #1E72FF -2.92%, #0250BE 102.1%)',
    },
    paragraph: {
      100: '#8D91A5',
    },
    line: {
      100: '#465065',
    },
    bg: {
      100: '#000224',
      200: '#1A203B',
      300: '#F4F6F9',
      400: 'rgba(0, 2, 36, 0.05)',
      500: 'rgba(0, 2, 36, 0.5)',
    },
    pressed: {
      100: '#0245C9',
    },
    border: {
      100: '#272D52',
      200: '#242b45',
      300: 'rgba(0, 2, 36, 0.1)',
    },
    yellow: {
      100: '#FFB547',
    },

    brand: {
      100: '#E9E3FF',
      200: '#422AFB',
      300: '#422AFB',
      400: '#7551FF',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#11047A',
    },
    brandScheme: {
      100: '#E9E3FF',
      200: '#7551FF',
      300: '#7551FF',
      400: '#7551FF',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#02044A',
    },
    brandTabs: {
      100: '#E9E3FF',
      200: '#422AFB',
      300: '#422AFB',
      400: '#422AFB',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#02044A',
    },
    secondaryGray: {
      100: '#E0E5F2',
      200: '#E1E9F8',
      300: '#F4F7FE',
      400: '#E9EDF7',
      500: '#8F9BBA',
      600: '#A3AED0',
      700: '#707EAE',
      800: '#707EAE',
      900: '#1B2559',
    },
    red: {
      100: '#EE5D50',
    },
    blue: {
      50: '#EFF4FB',
      100: '#4C84FF',
      200: '#2E5BFF',
      500: '#3965FF',
    },
    orange: {
      100: '#FFF6DA',
      500: '#FFB547',
    },
    green: {
      100: '#28C76F',
    },
    navy: {
      50: '#d0dcfb',
      100: '#aac0fe',
      200: '#a3b9f8',
      300: '#728fea',
      400: '#3652ba',
      500: '#1b3bbb',
      600: '#24388a',
      700: '#1B254B',
      800: '#111c44',
      900: '#0b1437',
    },
    gray: {
      100: '#FAFCFE',
    },
    white: {
      100: '#FFFFFF',
    },
    card: {
      100: '#101530',
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('bg.300', 'bg.100')(props),
        fontFamily: 'DM Sans',
        letterSpacing: '0.2px',
      },
      '.chakra-ui-light': {
        '.text-widget-input, .box-form, .menu-header, .header, .add-chart-full, .ace_scroller, .layout-config, .main-layout, .input-table, .first-box-table, .select-table, .dashboard-list__item--row, .editor-wrapper, .box-layout, .workspace-page__editor__header, .add-chart, .workspace-page__sidebar__categories, .workspace-page__sidebar__content':
          {
            background: mode('white.100', 'bgDark')(props),
          },

        '.box-text-widget, .google-login, .user-name, .text-result-data, .btn-cancel, .label-toggle, .label-input, .input-table, .select-table, .title-config, .visual-container__visualization__name, .visual-container__visualization':
          {
            color: mode('bg.100', 'white.100')(props),
          },

        '.table-main-markdown .chakra-collapse': {
          bg: mode('bg.300', 'bg.100')(props),
        },

        '.main-markdown': {
          borderBottom: mode('1px solid #E8EAED', '1px solid #2f3b58')(props),
        },

        '.dashboard-list__item--row, .box-layout': {
          boxShadow: mode('0px 15px 30px rgba(0, 0, 0, 0.04)', '')(props),
          border: mode('', '1px solid border.100')(props),
        },

        '.header-config': {
          background: mode('bg.400', 'bg.200')(props),
        },

        '.tag': {
          div: {
            background: mode('bg.400', 'bg.200')(props),
            color: mode('bg.500', 'white.100')(props),
          },
        },

        '.dashboards-page ': {
          '.dashboard-list__item--column': {
            background: mode('white.100', 'card.100')(props),
          },
          '.dashboard-list__item--column__content__title ': {
            borderBottom: mode(
              '1px solid border.300',
              '1px solid border.200',
            )(props),
          },
        },
      },

      '.table-temaplate': {
        table: {
          fontVariantNumeric: 'lining-nums tabular-nums',
          borderCollapse: 'collapse',
          w: 'full',
          th: {
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            textAlign: 'start',
            paddingInlineStart: 6,
            paddingInlineEnd: 6,
            pt: 3,
            pb: 3,
            lineHeight: '4',
            fontSize: 'xs',
            borderBottom: '1px',
            borderColor: mode('gray.100', 'gray.700')(props),
          },
          td: {
            paddingInlineStart: 6,
            paddingInlineEnd: 6,
            paddingTop: 4,
            paddingBottom: 4,
            lineHeight: 5,
            borderBottom: '1px',
            borderColor: mode('gray.100', 'gray.700')(props),
          },
        },
      },
      '.btn-primary': { background: 'main.200', color: 'white.100' },
      span: {
        color: mode('bg.100', '')(props),
      },
    }),
  },
};
