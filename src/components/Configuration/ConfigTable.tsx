import { Divider, Grid, GridItem, Text, Checkbox } from '@chakra-ui/react';
import { useState } from 'react';
import AppButton from '../AppButton';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';
import 'src/styles/components/TableConfig.scss';

interface IOption {
  value: string;
  label: string;
}

interface IDataForm {
  align: string;
  type: string;
}

const optionType: IOption[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'progress-bar', label: 'Progress bar' },
];

const optionAlign: IOption[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const ConfigTable = () => {
  const initDataLogin = {
    align: 'left',
    type: 'normal',
  };
  const [dataForm, setDataForm] = useState<IDataForm>(initDataLogin);
  return (
    <div className="main-layout">
      <header>
        <AppButton className="btn-add" size="sm">
          Add to dashboard
        </AppButton>
      </header>
      <Grid templateColumns="repeat(4, 1fr)">
        <GridItem>
          <div className="box-table">
            <Text fontWeight="bold" marginBottom="10px">
              Table options
            </Text>
            <div className="box-table-children">
              <div>Title</div>
              <AppInput
                value={'Query result'}
                size={'sm'}
                className="input-table"
              />
            </div>
          </div>
        </GridItem>
      </Grid>
      <Divider orientation="horizontal" borderColor={'gray'} />
      <Grid templateColumns="repeat(4, 1fr)" gap={'10px'}>
        {[1, 2, 3, 4].map((index) => (
          <GridItem key={index}>
            <div className="box-table">
              <Text fontWeight="bold" marginBottom="10px">
                Column {index}: time
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
                  value={dataForm.align}
                  onChange={(e) => setDataForm({ ...dataForm, align: e })}
                  options={optionAlign}
                />
              </div>
              <div className="box-table-children">
                <div>Format</div>
                <AppInput
                  placeholder="0.0"
                  size={'sm'}
                  className="input-table"
                />
              </div>
              <div className="box-table-children">
                <div>Type</div>

                <AppSelect2
                  className="select-table"
                  size="small"
                  value={dataForm.type}
                  onChange={(e) => setDataForm({ ...dataForm, type: e })}
                  options={optionType}
                />
              </div>
              <div className="main-checkbox">
                <Checkbox size="sm">Hide column</Checkbox>
              </div>
              <div className="main-checkbox">
                <Checkbox size="sm">Colored positive values</Checkbox>
              </div>
              <div className="main-checkbox">
                <Checkbox size="sm">Colored negative values</Checkbox>
              </div>
            </div>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default ConfigTable;
