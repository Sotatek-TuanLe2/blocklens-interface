import React, { FC } from 'react';
import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  EditableProps,
  useEditableControls,
} from '@chakra-ui/react';
import 'src/styles/components/AppEditable.scss';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

interface IAppEditableProps extends EditableProps {
  inputClassName?: string;
}

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton
        h={'30px'}
        aria-label="CheckIcon"
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />

      <IconButton
        h={'30px'}
        aria-label="CloseIcon"
        icon={<CloseIcon />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton
        aria-label="EditIcon"
        h={'30px'}
        icon={<EditIcon />}
        {...getEditButtonProps()}
      />
    </Flex>
  );
}

const AppEditable: FC<IAppEditableProps> = ({
  inputClassName = '',
  className = '',
  isPreviewFocusable,
  ...props
}) => {
  return (
    <Editable
      className={`app-editable ${className}`}
      isPreviewFocusable={isPreviewFocusable || false}
      {...props}
    >
      <EditablePreview className="app-editable__preview" />
      <Input
        className={`app-editable__input ${inputClassName}`}
        p={0}
        border={'none'}
        flex={1}
        as={EditableInput}
      />
      <EditableControls />
    </Editable>
  );
};

export default AppEditable;
