import { Checkbox, Divider, Grid, GridItem, Text } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import { Table } from '@tanstack/table-core';
import { FC, useState } from 'react';
import 'src/styles/components/TableConfig.scss';
import AppButton from '../AppButton';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';

interface IConfigTable {
  newColumns: any;
  updateDataNewTable: any;
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

const ConfigTable: FC<IConfigTable> = ({ newColumns, updateDataNewTable }) => {
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
        {newColumns.map((header: any) => (
          <GridItem key={header.index}>
            <TableOptions
              header={header}
              updateDataNewTable={updateDataNewTable}
            />
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default ConfigTable;

const TableOptions = ({ header, updateDataNewTable }: any) => {
  const [selectedItem, setSelectedItem] = useState(Object);

  return (
    <div className="box-table" onClick={() => setSelectedItem(header)}>
      <Text fontWeight="bold" marginBottom="10px">
        Column {header.index}: {header.accessorKey}
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
          value={header?.align}
          onChange={(e) => updateDataNewTable({ ...selectedItem, align: e })}
          options={optionAlign}
        />
      </div>
      <div className="box-table-children">
        <div>Format</div>
        <AppInput placeholder="0.0" size={'sm'} className="input-table" />
      </div>
      <div className="box-table-children">
        <div>Type</div>

        <AppSelect2
          className="select-table"
          size="small"
          value={header?.type}
          onChange={(e) => updateDataNewTable({ ...selectedItem, type: e })}
          options={optionType}
        />
      </div>
      <div className="main-checkbox">
        <Checkbox
          size="sm"
          value={header?.isHidden}
          onChange={(e) =>
            updateDataNewTable({ ...selectedItem, isHidden: e.target.checked })
          }
        >
          Hide column
        </Checkbox>
      </div>
      {header?.type === 'normal' ? (
        <div>
          <div className="main-checkbox">
            <Checkbox
              size="sm"
              value={header?.coloredPositive}
              onChange={(e) =>
                updateDataNewTable({
                  ...selectedItem,
                  coloredPositive: e.target.checked,
                })
              }
            >
              Colored positive values
            </Checkbox>
          </div>
          <div className="main-checkbox">
            <Checkbox
              size="sm"
              value={header?.coloredNegative}
              onChange={(e) =>
                updateDataNewTable({
                  ...selectedItem,
                  coloredNegative: e.target.checked,
                })
              }
            >
              Colored negative values
            </Checkbox>
          </div>
        </div>
      ) : (
        <div className="main-checkbox">
          <Checkbox
            size="sm"
            value={header?.coloredPositive}
            onChange={(e) =>
              updateDataNewTable({
                ...selectedItem,
                coloredPositive: e.target.checked,
                coloredNegative: e.target.checked,
              })
            }
          >
            Colored positive/negative values
          </Checkbox>
        </div>
      )}
    </div>
  );
};
