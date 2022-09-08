import React, { FC } from 'react';
import {
  Link,
  LinkProps,
  StyleProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { Link as ReactLink } from 'react-router-dom';

interface AppLinkProps extends LinkProps {
  to: string;
}

const AppLink: FC<AppLinkProps> = ({ ...props }) => {
  const colorLink = useColorModeValue('brand.500', 'brand.400');
  return (
    <Link as={ReactLink} {...props} color={colorLink}>
      {props.children}
    </Link>
  );
};

export const appLinkStyles = {
  baseStyle: {
    textDecoration: 'none',
    boxShadow: 'none',
    _focus: {
      boxShadow: 'none',
    },
    _active: {
      boxShadow: 'none',
    },
    _hover: {
      textDecoration: 'none',
      border: 'none',
    },
  },
  variants: {
    main: (props: StyleProps) => ({
      color: mode('brand.500', 'brand.400')(props),
      _hover: {
        textDecoration: 'underline',
      },
    }),
  },
};

export default AppLink;
