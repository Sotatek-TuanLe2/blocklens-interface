import { extendTheme, ThemeConfig, cssVar } from '@chakra-ui/react';
import { globalStyles } from 'src/themes/styles';
import { appButtonStyles } from 'src/components/AppButton';
import { appInputStyles } from 'src/components/AppInput';
import { appTextareaStyles } from 'src/components/AppTextarea';
import { appSwitchStyles } from 'src/components/AppSwitch';
import { cardStyles } from 'src/components/AppCard';
import { appLinkStyles } from 'src/components/AppLink';
import { appAccordionStyle } from 'src/components/AppAccordion';

// Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export default extendTheme({
  config,
  styles: globalStyles.styles,
  colors: globalStyles.colors,
  components: {
    Button: appButtonStyles,
    Input: appInputStyles,
    Textarea: appTextareaStyles,
    Switch: appSwitchStyles,
    Card: cardStyles,
    Link: appLinkStyles,
    Accordion: appAccordionStyle,
    Skeleton: {
      baseStyle: {
        [cssVar('skeleton-start-color').variable]: '#E5E6E9',
        [cssVar('skeleton-end-color').variable]: '#BFC2C9',
        opacity: '1 !important',
      },
    },
    Tooltip: {
      baseStyle: {
        color: '#000224',
        background: 'white',
        padding: '8px 10px',
        'border-radius': '6px',
        [cssVar('popper-arrow-bg').variable]: 'white',
      },
    },
  },
});
