import { Box, BoxProps, TagCloseButton, Text, Tooltip } from '@chakra-ui/react';
import 'src/styles/components/AppTag.scss';

interface ITag extends Omit<BoxProps, 'onClick'> {
  value: string;
  variant?: 'sm' | 'md';
  selected?: boolean;
  onClick?: (value: string) => void;
  classNames?: string;
  closable?: boolean;
  onClose?: (value: string) => void;
}

const AppTag: React.FC<ITag> = (props) => {
  const {
    value,
    variant = 'sm',
    selected = false,
    onClick,
    classNames,
    closable = false,
    onClose,
    ...otherProps
  } = props;

  const onClickTag = () => {
    if (onClick) {
      onClick(value);
    }
    return;
  };

  const onCloseTag = () => {
    if (onClose) {
      onClose(value);
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
        } ${closable ? 'app-tag--closable' : ''}`}
        onClick={onClickTag}
        {...otherProps}
      >
        <Text className={'app-tag-value'}>#{value}</Text>
        {closable && (
          <TagCloseButton
            className="app-tag__close-button"
            onClick={onCloseTag}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export default AppTag;
