import { Box, BoxProps } from '@chakra-ui/react';
import 'src/styles/components/AppTag.scss';

interface ITag extends Omit<BoxProps, 'onClick'> {
  value: string;
  variant?: 'sm' | 'md';
  selected?: boolean;
  onClick?: (value: string) => void;
  classNames?: string;
}

const AppTag: React.FC<ITag> = (props) => {
  const {
    value,
    variant = 'sm',
    selected = false,
    onClick,
    classNames,
    ...otherProps
  } = props;

  const onClickTag = () => {
    if (onClick) {
      onClick(value);
    }
    return;
  };

  return (
    <Box
      className={`app-tag app-tag--${variant} ${
        onClick ? 'app-tag--clickable' : ''
      } ${selected ? 'app-tag--selected' : ''} ${classNames ? classNames : ''}`}
      onClick={onClickTag}
      {...otherProps}
    >
      #{value}
    </Box>
  );
};

export default AppTag;
