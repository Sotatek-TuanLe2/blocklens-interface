import React from 'react';
import 'src/styles/components/CounterConfigurations.scss';
import AppButton from '../AppButton';
import { Grid, GridItem, Text } from '@chakra-ui/layout';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';
import { Checkbox } from '@chakra-ui/checkbox';
import { VisualizationType } from 'src/utils/query.type';

interface ICounterConfigurations {
  visualization: VisualizationType;
  onChangeConfigurations: (v: VisualizationType) => void;
}

const optionAlign = [
  { value: 'block_time', label: 'block_time' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const CounterConfiguration: React.FC<ICounterConfigurations> = ({
  visualization,
  onChangeConfigurations,
}) => {
  console.log(visualization);
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
        gap={'10px'}
      >
        <GridItem>
          <div className="box-table">
            <Text
              className="box-table__title"
              fontWeight="bold"
              marginBottom="10px"
            >
              Counter options
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
              <div>Align</div>
              <AppSelect2
                className="select-table z-100"
                size="small"
                value="block_time"
                options={optionAlign}
                onChange={(e) => console.log(e)}
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
        <GridItem>
          <div className="box-table">
            <Text
              className="box-table__title"
              fontWeight="bold"
              marginBottom="10px"
            >
              Formatting
            </Text>
            <div className="box-table-children">
              <div>Prefix</div>
              <AppInput placeholder="$" size={'sm'} className="input-table" />
            </div>
            <div className="box-table-children">
              <div>Suffix</div>
              <AppInput placeholder="M" size={'sm'} className="input-table" />
            </div>
            <div className="box-table-children">
              <div>Label</div>
              <AppInput
                placeholder="Current price"
                size={'sm'}
                className="input-table"
              />
            </div>
            <div className="box-table-children">
              <div>Decimals</div>
              <AppInput placeholder="1" size={'sm'} className="input-table" />
            </div>
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default CounterConfiguration;
