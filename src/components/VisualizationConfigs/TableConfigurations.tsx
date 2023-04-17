import { Checkbox, Divider, Grid, GridItem, Text } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import 'src/styles/components/TableConfigurations.scss';
import { VisualizationType } from 'src/utils/query.type';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';

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

interface ITableConfigurations {
  visualization: VisualizationType;
  onChangeConfigurations: (v: VisualizationType) => void;
  setDataColumn?: React.Dispatch<React.SetStateAction<ColumnDef<unknown>[]>>;
  dataColumn?: ColumnDef<unknown>[];
  dataTable?: any[];
}

const DEBOUNCE_TIME = 500;

const TableConfigurations: React.FC<ITableConfigurations> = ({
  visualization,
  onChangeConfigurations,
  dataColumn,
  dataTable,
  setDataColumn,
}) => {
  const [editVisualization, setEditVisualization] =
    useState<VisualizationType>(visualization);
  let timeout: any = null;

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      onChangeConfigurations(editVisualization);
    }, DEBOUNCE_TIME);

    return () => clearTimeout(timeout);
  }, [editVisualization]);

  const typeData = dataTable?.map((row) =>
    row.getVisibleCells().map((cells: any) => cells.getValue()),
  );

  const onChangeTableName = (e: any) => {
    setEditVisualization((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
  };

  const onChangeColumnConfigurations = (data: any, index: number) => {
    setEditVisualization((prevState) => {
      const newColumns = [...prevState.options.columns];
      newColumns[index] = data;
      return {
        ...prevState,
        options: {
          columns: newColumns,
        },
      };
    });
  };

  return (
    <div className="main-layout">
      {/* <header>
        <AppButton className="btn-add" size="sm">
          Add to dashboard
        </AppButton>
      </header> */}
      <Grid
        templateColumns={{
          sm: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        <GridItem>
          <div className="box-table first-box-table">
            <Text
              className="box-table__title"
              fontWeight="bold"
              marginBottom="10px"
            >
              Table options
            </Text>
            <div className="box-table-children">
              <div>Title</div>
              <AppInput
                value={editVisualization.name}
                size={'sm'}
                className="input-table"
                onChange={onChangeTableName}
              />
            </div>
          </div>
        </GridItem>
      </Grid>
      <Divider orientation="horizontal" borderColor={'gray'} />
      <Grid
        templateColumns={{
          sm: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gap={'10px'}
      >
        {!!dataColumn?.length ? (
          dataColumn?.map((data, index) => (
            <GridItem key={index}>
              <TableOptions
                data={data}
                typeData={typeData}
                index={index}
                onChange={onChangeColumnConfigurations}
                setDataColumn={setDataColumn}
                dataColumn={dataColumn}
              />
            </GridItem>
          ))
        ) : (
          <>Loading</>
        )}
      </Grid>
    </div>
  );
};

export default TableConfigurations;

const TableOptions = ({
  data,
  typeData,
  index,
  onChange,
  setDataColumn,
  dataColumn,
}: any) => {
  const [selectedItem, setSelectedItem] = useState(Object);

  const typeValue = typeof typeData?.[0]?.[index];

  const updateDataTable = (value: ColumnDef<unknown>) => {
    setDataColumn(
      dataColumn.map((item: ColumnDef<unknown>) =>
        item.id === value.id ? value : item,
      ),
    );
  };

  return (
    <div className="box-table" onClick={() => setSelectedItem(data)}>
      <Text className="box-table__title" fontWeight="bold" marginBottom="10px">
        Column {index}: {data.accessorKey}
      </Text>
      <div className="box-table-children">
        <div>Title</div>
        <AppInput
          value={data?.header}
          onChange={(e) =>
            updateDataTable({
              ...selectedItem,
              header: e.target.value,
            })
          }
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
          value={data?.align}
          onChange={(e) => updateDataTable({ ...selectedItem, align: e })}
          options={optionAlign}
        />
      </div>
      <div className="box-table-children">
        <div>Format</div>
        <AppInput
          placeholder="0.0"
          size={'sm'}
          className="input-table"
          value={data?.format}
          onChange={(e) =>
            updateDataTable({
              ...selectedItem,
              format: e.target.value,
            })
          }
        />
      </div>
      {typeValue === 'number' && (
        <div className="box-table-children">
          <div>Type</div>

          <AppSelect2
            className="select-table"
            size="small"
            value={data?.type}
            onChange={(e) => updateDataTable({ ...selectedItem, type: e })}
            options={optionType}
          />
        </div>
      )}

      <div className="main-checkbox">
        <Checkbox
          size="sm"
          value={data?.isHidden}
          onChange={(e) =>
            updateDataTable({
              ...selectedItem,
              isHidden: e.target.checked,
            })
          }
        >
          Hide column
        </Checkbox>
      </div>
      {typeValue === 'number' && data?.type === 'normal' ? (
        <div>
          <div className="main-checkbox">
            <Checkbox
              size="sm"
              value={data?.coloredPositive}
              onChange={(e) =>
                updateDataTable({
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
              value={data?.coloredNegative}
              onChange={(e) =>
                updateDataTable({
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
            value={data?.coloredProgress}
            onChange={(e) =>
              updateDataTable({
                ...selectedItem,
                coloredProgress: e.target.checked,
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
