import { Box } from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import 'src/styles/components/TableValue.scss';
import { VISUALIZATION_COLORS } from 'src/utils/common';
import { formatVisualizationValue } from 'src/utils/utils-format';
import { isNumber } from 'src/utils/utils-helper';
import { objectKeys } from 'src/utils/utils-network';

interface ReactTableProps<T> {
  data: T[];
  setDataTable?: React.Dispatch<React.SetStateAction<any[]>>;
  dataColumn?: ColumnDef<unknown>[];
}

export const getDefaultTableColumns = (data: any[]) => {
  const axisOptions = Array.isArray(data) && data[0] ? objectKeys(data[0]) : [];
  return axisOptions.map(
    (col) =>
      ({
        id: col,
        accessorKey: col,
        header: col,
        enableResizing: true,
        size: 100,
        align: 'left',
        type: 'normal',
        format: '',
        coloredPositive: false,
        coloredNegative: false,
        coloredProgress: false,
        isHidden: false,
      } as ColumnDef<unknown>),
  );
};

const VisualizationTable = <T,>({
  data,
  setDataTable,
  dataColumn,
}: ReactTableProps<T>) => {
  const table = useReactTable({
    data,
    columns: dataColumn || getDefaultTableColumns(data),
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDataTable && setDataTable(table.getRowModel().rows);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Box className="main-table" height={'460px'} overflow={'auto'}>
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
                const isNumberValue = isNumber(value);

                const checkColor = (value: any) => {
                  switch (true) {
                    case new BigNumber(value).isGreaterThan(0) &&
                      coloredPositive:
                      return VISUALIZATION_COLORS.POSITIVE;
                    case new BigNumber(value).isLessThan(0) && coloredNegative:
                      return VISUALIZATION_COLORS.NEGATIVE;
                    default:
                      return undefined;
                  }
                };

                return (
                  <td
                    {...{
                      key: cells.id,
                      style: {
                        width: cells.column.getSize(),
                        display: isHidden ? 'none' : undefined,
                      },
                    }}
                  >
                    <div
                      className="progressbar"
                      {...{
                        key: cells.id,
                        style: {
                          justifyContent: align,
                          color: isNumberValue
                            ? checkColor(cells.getValue())
                            : undefined,
                        },
                      }}
                    >
                      {type === 'normal' ? null : isNumberValue ? (
                        <div
                          style={
                            {
                              '--myColor': coloredProgress
                                ? VISUALIZATION_COLORS.POSITIVE
                                : '#3965ff',
                            } as React.CSSProperties
                          }
                          className="visual-progressbar"
                        ></div>
                      ) : null}
                      {!!value && formatVisualizationValue(format, value)}
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
