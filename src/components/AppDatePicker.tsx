import { InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { FC, forwardRef, Ref } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { CalendarIcon } from 'src/assets/icons';
import 'react-datepicker/dist/react-datepicker.css';
import AppInput from 'src/components/AppInput';
import { useForceRender } from 'src/hooks/useForceRender';
import SimpleReactValidator from 'simple-react-validator';

interface AppDatePicketProps extends ReactDatePickerProps {
  placeholder?: string;
  readOnly?: boolean;
  validate?: ValidatorProps;
}

interface ValidatorProps {
  validator: SimpleReactValidator;
  name: string;
  rule: string | Array<string | { [key: string]: unknown }>;
  options?: { [key: string]: unknown };
}

const AppDatePicker: FC<AppDatePicketProps> = ({
  placeholder = 'Select time',
  validate,
  readOnly,
  ...props
}) => {
  const forceRender = useForceRender();
  const onBlur = () => {
    validate?.validator.showMessageFor(validate.name);
    forceRender();
  };

  const getValidateMessage = () => {
    if (!validate || readOnly) {
      return null;
    }

    return (
      validate &&
      validate.validator.message(
        validate.name,
        props.selected,
        validate.rule,
        validate.options,
      )
    );
  };

  const PicketInput = forwardRef(
    ({ value, onClick }: any, ref: Ref<HTMLInputElement>) => {
      return (
        <>
          <InputGroup>
            <AppInput
              type="text"
              value={value}
              onClick={onClick}
              ref={ref}
              readOnly
              placeholder={placeholder}
            />
            <InputRightElement
              zIndex={0}
              p={3}
              pointerEvents="none"
              children={<CalendarIcon />}
              onClick={onClick}
            />
          </InputGroup>

          {getValidateMessage()}
        </>
      );
    },
  );

  return (
    <ReactDatePicker
      {...props}
      readOnly={readOnly}
      customInput={<PicketInput />}
      onCalendarClose={onBlur}
    />
  );
};

export default AppDatePicker;
