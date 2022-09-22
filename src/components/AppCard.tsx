import { Box, BoxProps, forwardRef, useStyleConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { StyleProps } from '@chakra-ui/system';

interface CardProps extends BoxProps {
  variant?: 'main' | 'sub';
}

const AppCard = forwardRef<CardProps, 'div'>(
  ({ variant = 'main', children, ...props }, ref) => {
    const styles = useStyleConfig('Card', { variant });
    return (
      <Box __css={styles} variant={variant} ref={ref} {...props}>
        {children}
      </Box>
    );
  },
);

export const cardStyles = {
  baseStyle: () => ({
    p: ['20px', '30px'],
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    borderRadius: '10px',
    minWidth: '0px',
    wordWrap: 'break-word',
    backgroundClip: 'border-box',
  }),
  variants: {
    main: (props: StyleProps) => ({
      bg: mode('#ffffff', 'navy.800')(props),
      boxShadow: mode('rgba(0, 0, 0, 0.05) 0px 5px 10px', 'unset')(props),
      border: mode('1px solid #E0E0E0', 'unset')(props),
    }),
    sub: (props: StyleProps) => ({
      bg: mode('#ffffff', 'navy.700')(props),
      boxShadow: mode('rgba(0, 0, 0, 0.05) 0px 5px 10px', 'unset')(props),
    }),
  },
};

export default AppCard;
