import { Grid, GridItem, Switch } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useRef, useState } from 'react';
import { VISUALIZATION_DEBOUNCE } from 'src/pages/WorkspacePage/parts/VisualizationDisplay';
import 'src/styles/components/TableConfigurations.scss';
import { VisualizationType } from 'src/utils/query.type';
import { isNumber } from 'src/utils/utils-helper';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';
import { getTableColumns } from '../Charts/VisualizationTable';

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
  data: any[];
  visualization: VisualizationType;
  onChangeConfigurations: (v: VisualizationType) => void;
  dataTable?: any[];
}

const TableConfigurations: React.FC<ITableConfigurations> = ({
  data,
  visualization,
  onChangeConfigurations,
  dataTable,
}) => {
  const [editVisualization, setEditVisualization] =
    useState<VisualizationType>(visualization);
  const dataColumns = getTableColumns(data, editVisualization);

  const optionColumn = useMemo(() => {
    return dataColumns
      .map((data: any) => data.accessorKey)
      .map((item, index: number) => ({
        value: index.toString(),
        label: `Column ${index + 1}: ${item}`,
      }));
  }, [dataColumns]);

  const [columnValue, setColumnValue] = useState<string>(optionColumn[0].value);
  const timeout = useRef() as any;

  const typeData = dataTable?.map((row) =>
    row.getVisibleCells().map((cells: any) => cells.getValue()),
  );

  const onChangeDebounce = (visualization: VisualizationType) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      onChangeConfigurations(visualization);
    }, VISUALIZATION_DEBOUNCE);
  };

  const onChangeVisualization = (visualization: VisualizationType) => {
    setEditVisualization(visualization);
    onChangeDebounce(visualization);
  };

  const onChangeTableName = (e: any) => {
    onChangeVisualization({
      ...editVisualization,
      name: e.target.value,
    });
  };

  const onChangeColumnConfigurations = (data: any) => {
    const newColumns = editVisualization?.options.columns
      ? [...editVisualization?.options.columns]
      : [];
    const existedIndex = newColumns.findIndex(
      (item: ColumnDef<unknown>) => item.id === data.id,
    );
    if (existedIndex >= 0) {
      newColumns[existedIndex] = data;
    } else {
      newColumns.push(data);
    }
    onChangeVisualization({
      ...editVisualization,
      options: {
        columns: newColumns,
      },
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
          md: 'repeat(1, 1fr)',
        }}
      >
        <GridItem>
          <div className="box-table first-box-table ">
            <div className="box-table-children">
              <div className="label-input">Title</div>
              <AppInput
                value={editVisualization.name}
                size={'sm'}
                className="input-table"
                onChange={onChangeTableName}
                placeholder="24h volume"
              />
            </div>
            <p className="divider-bottom" />
          </div>
        </GridItem>
      </Grid>
      <Grid
        templateColumns={{
          sm: 'repeat(1, 1fr)',
          md: 'repeat(1, 1fr)',
        }}
        className="layout-config"
      >
        <div className="select-column ">
          <AppSelect2
            className="select-table"
            zIndex={1001}
            size="medium"
            value={columnValue}
            onChange={(e) => setColumnValue(e)}
            options={optionColumn}
          />
        </div>
        {!!dataColumns?.length ? (
          dataColumns
            ?.filter((i, index) => (index.toString() === columnValue ? i : ''))
            ?.map((data: any, index: number) => (
              <GridItem key={index}>
                <TableOptions
                  data={data}
                  typeData={typeData}
                  index={columnValue}
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

  const isNumberValue = isNumber(typeData?.[0]?.[index]);

  return (
    <div className="box-table" onClick={() => setSelectedItem(data)}>
      <div className="box-table-children">
        <div className="label-input">Title</div>
        <AppInput
          value={data?.header}
          onChange={(e) =>
            onChange({
              ...selectedItem,
              header: e.target.value,
            })
          }
          placeholder={data?.accessorKey}
          size={'sm'}
          className="input-table"
        />
      </div>
      <div className="box-table-children">
        <div className="label-input">Align</div>

        <AppSelect2
          className="select-table z-100"
          size="medium"
          value={data?.align}
          onChange={(e) =>
            onChange({
              ...selectedItem,
              align: e,
            })
          }
          options={optionAlign}
        />
      </div>
      <div className="box-table-children">
        <div className="label-input">Format</div>
        <AppInput
          placeholder="0.0"
          size={'sm'}
          className="input-table"
          value={data?.format}
          onChange={(e) =>
            onChange({
              ...selectedItem,
              format: e.target.value,
            })
          }
        />
      </div>
      {isNumberValue && (
        <div className="box-table-children">
          <div className="label-input">Type</div>

          <AppSelect2
            className="select-table"
            size="medium"
            value={data?.type}
            onChange={(e) =>
              onChange({
                ...selectedItem,
                type: e,
                coloredProgress: false,
                coloredPositive: false,
                coloredNegative: false,
              })
            }
            options={optionType}
          />
        </div>
      )}

      <div className="main-toggle">
        <div className="label-toggle">Hide column</div>
        <Switch
          size="sm"
          value={data?.isHidden}
          isChecked={data?.isHidden}
          onChange={(e) =>
            onChange({
              ...selectedItem,
              isHidden: e.target.checked,
            })
          }
        />
      </div>
      {isNumberValue &&
        (data?.type === 'normal' ? (
          <div>
            <div className="main-toggle">
              <div className="label-toggle">Colored positive values</div>
              <Switch
                size="sm"
                value={data?.coloredPositive}
                isChecked={data?.coloredPositive}
                onChange={(e) =>
                  onChange({
                    ...selectedItem,
                    coloredPositive: e.target.checked,
                  })
                }
              />
            </div>
            <div className="main-toggle">
              <div className="label-toggle">Colored negative values</div>
              <Switch
                size="sm"
                value={data?.coloredNegative}
                isChecked={data?.coloredNegative}
                onChange={(e) =>
                  onChange({
                    ...selectedItem,
                    coloredNegative: e.target.checked,
                  })
                }
              />
            </div>
          </div>
        ) : (
          <div className="main-toggle">
            <div className="label-toggle">Colored positive/negative values</div>
            <Switch
              size="sm"
              value={data?.coloredProgress}
              isChecked={data?.coloredProgress}
              onChange={(e) =>
                onChange({
                  ...selectedItem,
                  coloredProgress: e.target.checked,
                  coloredPositive: e.target.checked,
                  coloredNegative: e.target.checked,
                })
              }
            />
          </div>
        ))}
    </div>
  );
};
