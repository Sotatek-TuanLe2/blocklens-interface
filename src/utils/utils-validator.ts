import SimpleReactValidator from 'simple-react-validator';
import { convertCurrencyToNumber } from './utils-helper';
import { isAddress } from 'ethers/lib/utils';

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
  | 'isDecimnals'
  | 'maxDigits'
  | 'isSame'
  | 'isAddress'
  | 'maxCountIds'
  | 'isIds'
  | 'insufficientBalance';

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
  element?: (message: string) => string | JSX.Element;
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
        rule: (val: string): boolean =>
          /^.+\.(mp4|wmv|mov|avi|webm)$/.test(val),
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
      isDecimnals: {
        message: 'Please input number from 0 to 9',
        rule: (val: string) => {
          return +val >= 0 && +val <= 9;
        },
      },
      isSame: {
        message: 'The value must be same password',
        rule: (value: string, params: string) => {
          return value === params[0];
        },
      },
      isAddress: {
        message: 'The value is wrong format address.',
        rule: (value: string) => {
          return isAddress(value);
        },
      },
      formatPassword: {
        message: 'Your password can’t start or end with a blank space',
        rule: (value: string) => {
          return !value.startsWith(' ') && !value.endsWith(' ');
        },
      },
      maxCountIds: {
        message: 'TokenIds must contain not more than 20 elements',
        rule: (value: string) => {
          const listTokenId = value.trim().split(', ');
          return listTokenId.length <= 20;
        },
      },
      isIds: {
        message: 'TokenId must be positive number.',
        rule: (value: string) => {
          const listTokenId = value.trim().split(',');
          return listTokenId.every((value: string) => {
            return /^[0-9]{1,}$/.test(value);
          });
        },
      },
      insufficientBalance: {
        message: 'Your balance is currently insufficient',
        rule: (value: string, params: string[]) => {
          return convertCurrencyToNumber(value) <= +params[0];
        },
      },
      maxTags: {
        message: 'Tags must contain not more than 3 elements',
        rule: (value: string) => {
          return value.split(',').filter((i) => i.trim().length).length <= 3;
        },
      },
      maxValue: {
        message: 'The :attribute must not exceed :params',
        rule: (valueInput: string, params: string) => {
          return +valueInput <= +params;
        },
        messageReplace: (message: string, params: string) =>
          message.replace(':params', params),
      },
      minValue: {
        message: 'The :attribute must not smaller than :params',
        rule: (valueInput: string, params: string) => {
          return +valueInput >= +params;
        },
        messageReplace: (message: string, params: string) =>
          message.replace(':params', params),
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
