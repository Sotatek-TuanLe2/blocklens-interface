import React, { FC } from 'react';
import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Input,
  Box,
  EditableProps,
  useEditableControls,
} from '@chakra-ui/react';
import { useForceRender } from 'src/hooks/useForceRender';
import { forwardRef } from '@chakra-ui/system';

import SimpleReactValidator from 'simple-react-validator';

import 'src/styles/components/AppEditable.scss';
import { EditIcon } from 'src/assets/icons';

interface ValidatorProps {
  validator: SimpleReactValidator;
  name: string;
  rule: string | Array<string | { [key: string]: unknown }>;
  options?: { [key: string]: unknown };
}

interface IAppEditableProps extends EditableProps {
  inputClassName?: string;
  hiddenErrorText?: boolean;
  readOnly?: boolean;
  validate?: ValidatorProps;
}

function EditableControls() {
  const { isEditing, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton
        h={'30px'}
        aria-label="EditIcon"
        icon={<EditIcon />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton
        aria-label="EditIcon"
        h={'30px'}
        icon={<EditIcon />}
        {...getEditButtonProps()}
      />
    </ButtonGroup>
  );
}

const AppEditable = forwardRef<IAppEditableProps, any>(
  (
    {
      inputClassName = '',
      className = '',
      isPreviewFocusable,
      onBlur,
      readOnly,
      hiddenErrorText,
      validate,
      ...props
    },
    ref,
  ) => {
    const forceRender = useForceRender();

    const onEditableBlur = (value: any) => {
      validate?.validator.showMessageFor(validate.name);
      forceRender();
      onBlur?.(value);
    };
    return (
      <>
        <Editable
          className={`app-editable ${className}`}
          isPreviewFocusable={isPreviewFocusable || false}
          {...props}
          onBlur={onEditableBlur}
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
        <Box>
          {!hiddenErrorText &&
            validate &&
            !readOnly &&
            validate.validator.message(
              validate.name,
              props.value
                ? props.value
                : ref
                ? (ref as any).current?.value
                : '',
              validate.rule,
              validate.options,
            )}
        </Box>
      </>
    );
  },
);

export default AppEditable;
