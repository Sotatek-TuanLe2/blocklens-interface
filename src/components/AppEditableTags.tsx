import React, { useState, useMemo } from 'react';
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
  Tooltip,
} from '@chakra-ui/react';
import { forwardRef } from '@chakra-ui/system';
import 'src/styles/components/AppEditableTags.scss';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';
import _ from 'lodash';

interface IAppEditableTagsProps {
  tags: string[];
  className?: string;
  onSubmit?: (value: string) => void;
  onRemove?: (value: string) => void;
}

const CustomInput = ({
  onCancel,
  isDisabled,
}: {
  onCancel: () => void;
  isDisabled?: boolean;
}) => {
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
    <Box
      className={`${isDisabled ? 'disabled' : ''} hashtag-add`}
      {...getEditButtonProps()}
      p={'4px 11px'}
    >
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
  isDisabled,
}: {
  onSubmit?: (nextValue: string) => void;
  isDisabled?: boolean;
}) => {
  const [value, setValue] = useState<string>();
  const handleSubmit = (nextValue: string) => {
    onSubmit && onSubmit(nextValue.slice(0, 30));
    setValue('');
  };
  return (
    <Editable
      submitOnBlur
      isDisabled={isDisabled}
      onSubmit={handleSubmit}
      value={value}
      onChange={setValue}
      className={`hashtags-editable`}
    >
      <CustomInput onCancel={() => setValue('')} isDisabled={isDisabled} />
    </Editable>
  );
};

const AppEditableTags = forwardRef<IAppEditableTagsProps, any>(
  ({ tags, className = '', onSubmit, onRemove }, ref) => {
    const uniqueTags = useMemo(() => {
      return _.uniq(tags.map((i) => i.toLowerCase()));
    }, [tags]);

    return (
      <>
        <Flex
          ref={ref}
          wrap={'wrap'}
          className={`app-hashtags ${className}`}
          gap={2}
        >
          {uniqueTags?.map((tag, index) => {
            return (
              <Flex key={tag + index} className="app-hashtags__item">
                <Flex className="app-hashtags__item--text">
                  #
                  {tag.length > 10 ? (
                    <Tooltip hasArrow placement="top" label={tag}>
                      <Flex className="app-hashtags__item--text">
                        {tag.slice(0, 10)}
                        ...
                      </Flex>
                    </Tooltip>
                  ) : (
                    tag
                  )}
                </Flex>
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
          {tags.length < 20 && <AddHashtags onSubmit={onSubmit} />}
        </Flex>
      </>
    );
  },
);

export default AppEditableTags;
