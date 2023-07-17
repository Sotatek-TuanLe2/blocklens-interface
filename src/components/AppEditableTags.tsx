import React, { FC, useState, useRef } from 'react';
import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  EditableProps,
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

const CustomInput = () => {
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
            // size="xs"
            variant="unstyled"
            icon={<CloseIcon />}
            {...getCancelButtonProps()}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
};

const AddHashtags = () => {
  return (
    <Editable className={`hashtags-editable`}>
      <CustomPreview />
      <CustomInput />
    </Editable>
  );
};

const AppEditableTags: FC<IAppEditableTagsProps> = ({
  tags,
  className,
  ...props
}) => {
  return (
    <Flex wrap={'wrap'} className="app-hashtags" gap={2}>
      {tags?.map((tag) => {
        return (
          <Flex key={tag} className="app-hashtags__item">
            {tag}
            <IconButton
              aria-label="close"
              className="icon-btn"
              variant="unstyled"
              size="xs"
              icon={<CloseIcon />}
            />
          </Flex>
        );
      })}
      <AddHashtags />
    </Flex>
  );
};

export default AppEditableTags;
