import { Checkbox, Divider, Grid, GridItem, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import 'src/styles/components/TableConfigurations.scss';
import AppButton from '../AppButton';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { updateDatTable } from 'src/store/configuration';
import { VisualizationType } from 'src/utils/query.type';
import { debounce } from 'lodash';

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
}

const DEBOUNCE_TIME = 500;

const TableConfigurations: React.FC<ITableConfigurations> = ({
  visualization,
  onChangeConfigurations,
}) => {
  const { columnData, dataTable } = useSelector(
    (state: RootState) => state.configuration,
  );
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

  const typeData = dataTable.map((row) =>
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

  console.log('columnData', columnData);

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
        {columnData.map((data, index) => (
          <GridItem key={index}>
            <TableOptions
              data={data}
              typeData={typeData}
              index={index}
              onChange={onChangeColumnConfigurations}
            />
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default TableConfigurations;

const TableOptions = ({ data, typeData, index, onChange }: any) => {
  const dispatch = useDispatch();

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
            dispatch(
              updateDatTable({
                newData: { ...selectedItem, header: e.target.value },
              }),
            )
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
          onChange={(e) =>
            dispatch(updateDatTable({ newData: { ...selectedItem, align: e } }))
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
            dispatch(
              updateDatTable({
                newData: { ...selectedItem, format: e.target.value },
              }),
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
              dispatch(
                updateDatTable({ newData: { ...selectedItem, type: e } }),
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
          onChange={(e) =>
            dispatch(
              updateDatTable({
                newData: { ...selectedItem, isHidden: e.target.checked },
              }),
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
              onChange={(e) =>
                dispatch(
                  updateDatTable({
                    newData: {
                      ...selectedItem,
                      coloredPositive: e.target.checked,
                    },
                  }),
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
              onChange={(e) =>
                dispatch(
                  updateDatTable({
                    newData: {
                      ...selectedItem,
                      coloredNegative: e.target.checked,
                    },
                  }),
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
            onChange={(e) =>
              dispatch(
                updateDatTable({
                  newData: {
                    ...selectedItem,
                    coloredProgress: e.target.checked,
                  },
                }),
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
