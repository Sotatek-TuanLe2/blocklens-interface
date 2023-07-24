import React, { useState } from 'react';
import {
  Editable,
  EditableInput,
  Flex,
  IconButton,
  Input,
  InputLeftElement,
  InputRightElement,
  InputGroup,
  useEditableControls,
  Box,
} from '@chakra-ui/react';
import { forwardRef } from '@chakra-ui/system';
import 'src/styles/components/AppEditableTags.scss';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';

interface IAppEditableTagsProps {
  tags: string[];
  className?: string;
  onSubmit?: (value: string) => void;
  onRemove?: (value: string) => void;
}

const CustomInput = ({ onCancel }: { onCancel: () => void }) => {
  const { isEditing, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();
  return isEditing ? (
    <InputGroup size="sm" className={`hashtags-editable__input`}>
      {<InputLeftElement pointerEvents="none">#</InputLeftElement>}
      <Input
        as={EditableInput}
        borderRadius={'6px'}
        border="none"
        placeholder=""
      />
      <InputRightElement>
        <IconButton
          className="icon-btn"
          aria-label="close"
          variant="unstyled"
          icon={<CloseIcon w={'9px'} h={'9px'} />}
          {...getCancelButtonProps({
            onClick: onCancel,
          })}
        />
      </InputRightElement>
    </InputGroup>
  ) : (
    <Box className="hashtag-add" {...getEditButtonProps()} p={'4px 11px'}>
      <IconButton
        aria-label="add"
        className="icon-btn"
        size="xs"
        variant="unstyled"
        icon={<AddIcon w={'11px'} h={'11px'} />}
      />
      Add
    </Box>
  );
};

const AddHashtags = ({
  onSubmit,
}: {
  onSubmit?: (nextValue: string) => void;
}) => {
  const [value, setValue] = useState<string>();
  const handleSubmit = (nextValue: string) => {
    onSubmit && onSubmit(nextValue);
    setValue('');
  };
  return (
    <Editable
      submitOnBlur
      onSubmit={handleSubmit}
      value={value}
      onChange={setValue}
      className={`hashtags-editable`}
    >
      <CustomInput onCancel={() => setValue('')} />
    </Editable>
  );
};

const AppEditableTags = forwardRef<IAppEditableTagsProps, any>(
  ({ tags, className = '', onSubmit, onRemove }, ref) => {
    return (
      <>
        <Flex
          ref={ref}
          wrap={'wrap'}
          className={`app-hashtags ${className}`}
          gap={2}
        >
          {tags?.map((tag, index) => {
            return (
              <Flex key={tag + index} className="app-hashtags__item">
                #{tag}
                {onRemove && (
                  <IconButton
                    aria-label="close"
                    className="icon-btn"
                    variant="unstyled"
                    size="xs"
                    onClick={() => onRemove(tag)}
                    icon={<CloseIcon w={'9px'} h={'9px'} />}
                  />
                )}
              </Flex>
            );
          })}
          <AddHashtags onSubmit={onSubmit} />
        </Flex>
      </>
    );
  },
);

export default AppEditableTags;
