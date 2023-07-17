import React, { FC, useState } from 'react';
import { chakra } from '@chakra-ui/system';
import {
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  InputLeftElement,
  InputRightElement,
  InputGroup,
  useEditableControls,
  Box,
} from '@chakra-ui/react';
import 'src/styles/components/AppEditableTags.scss';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';

interface IAppEditableTagsProps {
  tags: string[];
  className?: string;
  onSubmit?: (value: string) => void;
  onRemove?: (value: string) => void;
}

const CustomPreview = () => {
  const { isEditing, getEditButtonProps } = useEditableControls();
  return (
    <span as={<EditablePreview />} {...getEditButtonProps()}>
      {!isEditing && (
        <Box className="hashtag-add" p={'4px 10px'}>
          <IconButton
            aria-label="add"
            className="icon-btn"
            size="xs"
            variant="unstyled"
            icon={<AddIcon />}
          />
          Add
        </Box>
      )}
    </span>
  );
};

const CustomInput = ({ onCancel }: { onCancel: () => void }) => {
  const { isEditing, getCancelButtonProps } = useEditableControls();
  return (
    <InputGroup size="sm" className={`hashtags-editable__input`}>
      {isEditing && <InputLeftElement pointerEvents="none">#</InputLeftElement>}
      <Input as={EditableInput} max border="none" placeholder="" />
      {isEditing && (
        <InputRightElement>
          <IconButton
            className="icon-btn"
            aria-label="close"
            variant="unstyled"
            icon={<CloseIcon />}
            {...getCancelButtonProps({
              onClick: onCancel,
            })}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
};

const AddHashtags = ({
  onSubmit,
}: {
  onSubmit: (nextValue: string) => void;
}) => {
  const [value, setValue] = useState<string>();
  const handleSubmit = (nextValue: string) => {
    onSubmit(nextValue);
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
      <CustomPreview />
      <CustomInput onCancel={() => setValue('')} />
    </Editable>
  );
};

const AppEditableTags: FC<IAppEditableTagsProps> = ({
  tags,
  className,
  onSubmit,
  onRemove,
  ...props
}) => {
  return (
    <Flex wrap={'wrap'} className="app-hashtags" gap={2}>
      {tags?.map((tag, index) => {
        return (
          <Flex key={tag + index} className="app-hashtags__item">
            #{tag}
            <IconButton
              aria-label="close"
              className="icon-btn"
              variant="unstyled"
              size="xs"
              onClick={() => onRemove(tag)}
              icon={<CloseIcon />}
            />
          </Flex>
        );
      })}
      <AddHashtags onSubmit={onSubmit} />
    </Flex>
  );
};

export default AppEditableTags;
