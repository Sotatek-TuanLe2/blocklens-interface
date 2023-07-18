import React, { FC, ReactNode } from 'react';
import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Box,
  Flex,
  IconButton,
  Input,
  EditableProps,
  useEditableControls,
} from '@chakra-ui/react';
import 'src/styles/components/AppEditable.scss';
import { CheckIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { AppButton } from 'src/components';

interface IAppEditableProps extends EditableProps {
  inputClassName?: string;
  labelBtn?: string;
  onCancel?: () => void;
}

interface IEditableControlProps {
  onCancel?: () => void;
  labelBtn?: string;
}

function EditableControls2({ onCancel, labelBtn }: IEditableControlProps) {
  const { isEditing, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup pr={4} justifyContent="center" size="sm">
      <IconButton
        h={'30px'}
        aria-label="CloseIcon"
        icon={<CloseIcon />}
        {...getCancelButtonProps({
          onClick: onCancel,
        })}
      />
    </ButtonGroup>
  ) : (
    <AppButton
      w="100%"
      size={'sm'}
      color="bg.500"
      variant="cancel"
      border="none"
      justifyContent="start"
      {...getEditButtonProps()}
    >
      <AddIcon mx={4} />
      {labelBtn || 'Edit'}
    </AppButton>
  );
}

export const AppEditable2: FC<IAppEditableProps> = ({
  inputClassName = '',
  className = '',
  isPreviewFocusable,
  labelBtn,
  onCancel,
  ...props
}) => {
  return (
    <Editable
      className={`app-editable ${className}`}
      isPreviewFocusable={isPreviewFocusable || false}
      {...props}
    >
      <Input
        className={`app-editable__input ${inputClassName}`}
        border={'none'}
        flex={1}
        as={EditableInput}
      />
      <EditableControls2 labelBtn={labelBtn} onCancel={onCancel} />
    </Editable>
  );
};

export default AppEditable2;
