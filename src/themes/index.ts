import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { globalStyles, tabsStyles } from 'src/themes/styles';
import { appButtonStyles } from 'src/components/AppButton';
import { appInputStyles } from 'src/components/AppInput';
import { appTextareaStyles } from 'src/components/AppTextarea';
import { appSelectStyles } from 'src/components/AppSelect';
import { appSwitchStyles } from 'src/components/AppSwitch';
import { cardStyles } from 'src/components/Card';
import { appLinkStyles } from 'src/components/AppLink';

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
    Select: appSelectStyles,
    Switch: appSwitchStyles,
    Card: cardStyles,
    Link: appLinkStyles,
    Tabs: tabsStyles,
  },
});
