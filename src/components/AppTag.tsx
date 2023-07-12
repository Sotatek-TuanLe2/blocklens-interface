import { Box, BoxProps, Text, Tooltip } from '@chakra-ui/react';
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
    <Tooltip p={2} hasArrow placement="top" label={`#${value}`}>
      <Box
        className={`app-tag app-tag--${variant} ${
          onClick ? 'app-tag--clickable' : ''
        } ${selected ? 'app-tag--selected' : ''} ${
          classNames ? classNames : ''
        }`}
        onClick={onClickTag}
        {...otherProps}
      >
        <Text className={'app-tag-value'}>#{value}</Text>
      </Box>
    </Tooltip>
  );
};

export default AppTag;
