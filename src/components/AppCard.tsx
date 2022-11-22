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
    p: ['30px', '40px'],
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    borderRadius: '18px',
    minWidth: '0px',
    wordWrap: 'break-word',
    backgroundClip: 'border-box',
  }),
  variants: {
    main: (props: StyleProps) => ({
      bg: mode('card.100', 'card.100')(props),
    }),
  },
};

export default AppCard;
