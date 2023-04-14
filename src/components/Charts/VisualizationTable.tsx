import { Box } from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { setColumn, setDataTable } from 'src/store/configuration';
import 'src/styles/components/TableValue.scss';
import {
  formatNumberToCurrency,
  formatNumberWithDecimalDigits,
} from 'src/utils/utils-format';

interface ReactTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
}

const VisualizationTable = <T,>({
  data,
  columns: dataColumn,
}: ReactTableProps<T>) => {
  const { columnData } = useSelector((state: RootState) => state.configuration);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setColumn(dataColumn));
  }, [dataColumn]);
  const table = useReactTable({
    data,
    columns: columnData,
    getCoreRowModel: getCoreRowModel(),
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDataTable(table.getRowModel().rows));
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Box height={'500px'} overflow={'auto'}>
      <table
        className={'table-value'}
        {...{
          style: {
            height: '100%',
            width: table.getCenterTotalSize(),
            boxShadow: 'inset 0 0 0 1px lightgray',
          },
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              style={{
                width: 'fit-content',
                // display: 'flex',
              }}
            >
              {headerGroup.headers.map((header: any) => (
                <th
                  {...{
                    key: header.id,
                    style: {
                      width: header.getSize(),
                      boxShadow: 'inset 0 0 0 1px lightgray',
                      textAlign: header.column.columnDef.align,
                      display: header.column.columnDef.isHidden
                        ? 'none'
                        : undefined,
                    },
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  <div
                    {...{
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`,
                      style: {
                        transform: header.column.getIsResizing()
                          ? `translateX(${
                              table.getState().columnSizingInfo.deltaOffset
                            }px)`
                          : '',
                      },
                    }}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cells: any) => {
                const {
                  align,
                  isHidden,
                  coloredPositive,
                  coloredNegative,
                  type,
                  format,
                  coloredProgress,
                } = cells.column.columnDef;
                const value = cells.getValue();
                const checkColor = (value: any) => {
                  switch (true) {
                    case value > 0 && coloredPositive:
                      return '#006400';
                    case value < 0 && coloredNegative:
                      return '#d93025';
                    default:
                      return undefined;
                  }
                };
                const checkFormatValue = (format: string) => {
                  switch (typeof value === 'number') {
                    case format.includes(','):
                      return value.toLocaleString('en-US');
                    case format.includes('0.'):
                      return formatNumberWithDecimalDigits(value, format);
                    case format === '0':
                      return parseInt(value);
                    case format === 'a':
                      return formatNumberToCurrency(value);
                    case format === '$':
                      return `$${value}`;
                    case format.includes('a') && format.includes('$'):
                      return `$${formatNumberToCurrency(value)}`;
                    default:
                      return value;
                  }
                };
                return (
                  <td
                    {...{
                      key: cells.id,
                      style: {
                        width: cells.column.getSize(),
                      },
                    }}
                  >
                    <div
                      className="progressbar"
                      {...{
                        key: cells.id,
                        style: {
                          justifyContent: align,
                          display: isHidden ? 'none' : undefined,
                          color:
                            typeof value === 'number'
                              ? checkColor(cells.getValue())
                              : undefined,
                        },
                      }}
                    >
                      {type === 'normal' ? null : typeof value === 'number' ? (
                        <div
                          style={
                            {
                              '--myColor': coloredProgress
                                ? '#006400'
                                : '#3965ff',
                            } as React.CSSProperties
                          }
                          className="visual-progressbar"
                        ></div>
                      ) : null}
                      {checkFormatValue(format)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default VisualizationTable;
