import { Checkbox, Divider, Grid, GridItem, Text } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { VISUALIZATION_DEBOUNCE } from 'src/pages/QueriesPage/part/VisualizationDisplay';
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
  dataTable?: any[];
}

const TableConfigurations: React.FC<ITableConfigurations> = ({
  visualization,
  onChangeConfigurations,
  dataTable,
}) => {
  const [editVisualization, setEditVisualization] =
    useState<VisualizationType>(visualization);
  let timeout: any = null;

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      onChangeConfigurations(editVisualization);
    }, VISUALIZATION_DEBOUNCE);

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
  const dataColumn: [] = editVisualization.options.columns;

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

const TableOptions = ({ data, typeData, index, onChange }: any) => {
  const [selectedItem, setSelectedItem] = useState(Object);

  const typeValue = typeof typeData?.[0]?.[index];

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
            onChange(
              {
                ...selectedItem,
                header: e.target.value,
              },
              index,
            )
          }
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
          value={data?.align}
          onChange={(e) =>
            onChange(
              {
                ...selectedItem,
                align: e,
              },
              index,
            )
          }
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
            onChange(
              {
                ...selectedItem,
                format: e.target.value,
              },
              index,
            )
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
            onChange={(e) =>
              onChange(
                {
                  ...selectedItem,
                  type: e,
                },
                index,
              )
            }
            options={optionType}
          />
        </div>
      )}

      <div className="main-checkbox">
        <Checkbox
          size="sm"
          value={data?.isHidden}
          isChecked={data?.isHidden}
          onChange={(e) =>
            onChange(
              {
                ...selectedItem,
                isHidden: e.target.checked,
              },
              index,
            )
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
              isChecked={data?.coloredPositive}
              onChange={(e) =>
                onChange(
                  {
                    ...selectedItem,
                    coloredPositive: e.target.checked,
                  },
                  index,
                )
              }
            >
              Colored positive values
            </Checkbox>
          </div>
          <div className="main-checkbox">
            <Checkbox
              size="sm"
              value={data?.coloredNegative}
              isChecked={data?.coloredNegative}
              onChange={(e) =>
                onChange(
                  {
                    ...selectedItem,
                    coloredNegative: e.target.checked,
                  },
                  index,
                )
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
            isChecked={data?.coloredProgress}
            onChange={(e) =>
              onChange(
                {
                  ...selectedItem,
                  coloredProgress: e.target.checked,
                },
                index,
              )
            }
          >
            Colored positive/negative values
          </Checkbox>
        </div>
      )}
    </div>
  );
};
