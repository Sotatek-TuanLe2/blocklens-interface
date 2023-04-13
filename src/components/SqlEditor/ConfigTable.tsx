import { Checkbox, Divider, Grid, GridItem, Text } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import { Table } from '@tanstack/table-core';
import { FC, useState } from 'react';
import 'src/styles/components/TableConfig.scss';
import AppButton from '../AppButton';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';

interface IConfigTable {
  table: Table<any>;
}
interface IOption {
  value: string;
  label: string;
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

const ConfigTable: FC<IConfigTable> = ({ table }) => {
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
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <GridItem key={header.index}>
              <TableOptions header={header} table={table} />
            </GridItem>
          )),
        )}
      </Grid>
    </div>
  );
};

export default ConfigTable;

const TableOptions = ({ header }: any) => {
  const [first, setfirst] = useState();
  console.log(first, 'first');
  return (
    <div className="box-table" onClick={() => setfirst(header)}>
      <Text fontWeight="bold" marginBottom="10px">
        Column {header.index}:{' '}
        {flexRender(header.column.columnDef.header, header.getContext())}
      </Text>
      <div className="box-table-children">
        <div>Title</div>
        <AppInput placeholder="Price" size={'sm'} className="input-table" />
      </div>
      <div className="box-table-children">
        <div className="ok">Align</div>

        <AppSelect2
          className="select-table z-100"
          size="small"
          // value={dataForm.align}
          onChange={(e) => console.log(e)}
          options={optionAlign}
        />
      </div>
      <div className="box-table-children">
        <div>Format</div>
        <AppInput placeholder="0.0" size={'sm'} className="input-table" />
      </div>
      <div className="box-table-children">
        <div>Type</div>

        {/* <AppSelect2
          className="select-table"
          size="small"
          value={dataForm.type}
          onChange={(e) => setDataForm({ ...dataForm, type: e })}
          options={optionType}
        /> */}
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
  );
};
