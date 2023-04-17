import React from 'react';
import 'src/styles/components/CounterConfigurations.scss';
import AppButton from '../AppButton';
import { Grid, GridItem, Text } from '@chakra-ui/layout';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';
import { Checkbox } from '@chakra-ui/checkbox';

const optionAlign = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const CounterConfiguration = () => {
  return (
    <div className="config-counter">
      <header>
        <AppButton className="btn-add" size="sm">
          Add to dashboard
        </AppButton>
      </header>
      <Grid
        templateColumns={{
          sm: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        <GridItem>
          <div className="box-table">
            <Text
              className="box-table__title"
              fontWeight="bold"
              marginBottom="10px"
            >
              Column
            </Text>
            <div className="box-table-children">
              <div>Title</div>
              <AppInput
                placeholder="Price"
                size={'sm'}
                className="input-table"
              />
            </div>
            <div className="box-table-children">
              <div className="ok">Align</div>
              <AppSelect2
                className="select-table z-100"
                size="small"
                options={optionAlign}
              />
            </div>
            <div className="box-table-children">
              <div>Row number</div>
              <AppInput
                placeholder="Price"
                size={'sm'}
                className="input-table"
              />
            </div>
            <div className="main-checkbox">
              <Checkbox size="sm">Colored positive values</Checkbox>
            </div>
            <div className="main-checkbox">
              <Checkbox size="sm">Colored negative values</Checkbox>
            </div>
          </div>
        </GridItem>
        <GridItem>CounterConfiguration</GridItem>
      </Grid>
    </div>
  );
};

export default CounterConfiguration;
