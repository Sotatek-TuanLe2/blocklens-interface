import SimpleReactValidator from 'simple-react-validator';
import { ReactNode } from 'react';

type IRule =
  | 'accepted'
  | 'after'
  | 'after_or_equal'
  | 'alpha'
  | 'alpha_space'
  | 'alpha_num'
  | ' alpha_num_space'
  | 'alpha_num_dash'
  | 'alpha_num_dash_space'
  | 'array'
  | 'before'
  | 'before_or_equal'
  | 'between'
  | 'boolean'
  | 'card_exp'
  | 'card_num'
  | 'currency'
  | 'date'
  | 'date_equals'
  | 'email'
  | 'in'
  | 'integer'
  | 'max'
  | 'min'
  | 'not_in'
  | 'not_regex'
  | 'numeric'
  | 'phone'
  | 'regex'
  | 'required'
  | 'size'
  | 'string'
  | 'typeof'
  | 'url';

type CustomRule =
  | 'logoUrl'
  | 'videoUrl'
  | 'minValue'
  | 'maxValue'
  | 'isPositive'
  | 'maxDigits';

export type Rules = IRule | CustomRule;

interface IRules {
  [key: Rules | string]: {
    message: string;
    rule: (val: string, params?: string) => boolean;
  };
}

interface IOptions {
  validators?: IRules;
  messages?: string;
  className?: string;
  element?: (message: string) => ReactNode;
  locale?: string;
}

export const createValidator = (options?: IOptions | undefined) => {
  let defaultOptions = {
    validators: {
      logoUrl: {
        message: 'The logo must end in “jpeg”, “jpg” or “png”',
        rule: (val: string): boolean => /^.+\.(jpeg|jpg|png)$/.test(val),
      },
      videoUrl: {
        message: 'The video must end in “mp4”, “wmv”, “mov”, “avi” or “webm”',
        rule: (val: string): boolean => /^.+\.(mp4|wmv|mov|avi|webm)$/.test(val),
      },
      maxDigits: {
        message: 'Please enter :params digits only.',
        rule: (val: string, params: string | number): boolean => {
          const REGEX_VALUE = new RegExp(
            `^-?[0-9]{0,}[.]{0,1}[0-9]{0,${params}}$`,
          );
          return REGEX_VALUE.test(val);
        },
        messageReplace: (message: string, params: string) =>
          message.replace(':params', params),
      },
      isPositive: {
        message: 'The value must be greater than 0',
        rule: (val: string) => {
          return +val > 0;
        },
      },
    },
  };
  if (options) {
    const { validators, ...others } = options;
    defaultOptions = {
      ...defaultOptions,
      validators: {
        ...defaultOptions.validators,
        ...validators,
      },
      ...others,
    };
  }

  return new SimpleReactValidator(defaultOptions);
};
