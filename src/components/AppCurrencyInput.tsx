import React from 'react';
import MaskedInput, { MaskedInputProps } from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';

const defaultMaskOptions = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 4, // how many digits allowed after the decimal
  // integerLimit: 7, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
};

const AppCurrencyInput = (props: Omit<MaskedInputProps, 'mask'>) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
  });

  return <MaskedInput mask={currencyMask} {...props} />;
};

export default AppCurrencyInput;
