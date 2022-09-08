import { Switch, SwitchProps } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { StyleProps } from '@chakra-ui/system';
import { FC } from 'react';

const AppSwitch: FC<SwitchProps> = ({ ...props }) => {
  return <Switch {...props} variant={'main'} />;
};

export default AppSwitch;

export const appSwitchStyles = {
  baseStyle: {
    thumb: {
      fontWeight: 400,
      borderRadius: '50%',
      w: '16px',
      h: '16px',
      _checked: { transform: 'translate(20px, 0px)' },
    },
    track: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      w: '40px',
      h: '20px',
      p: '2px',
      ps: '2px',
      _focus: {
        boxShadow: 'none',
      },
    },
  },

  variants: {
    main: (props: StyleProps) => ({
      track: {
        bg: mode('gray.300', 'navy.700')(props),
      },
    }),
  },
};
