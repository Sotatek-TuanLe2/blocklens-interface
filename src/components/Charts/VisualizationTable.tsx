import { Box } from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import 'src/styles/components/TableValue.scss';
import { VISUALIZATION_COLORS } from 'src/utils/common';
import { VisualizationType } from 'src/utils/query.type';
import { formatVisualizationValue } from 'src/utils/utils-format';
import { isNumber } from 'src/utils/utils-helper';
import { objectKeys } from 'src/utils/utils-network';
import TablePagination from './TablePagination';

interface ReactTableProps<T> {
  data: T[];
  setDataTable?: React.Dispatch<React.SetStateAction<any[]>>;
  visualization?: VisualizationType;
}

const COLUMN_TYPES = {
  NORMAL: 'normal',
  PROGRESS: 'progress-bar',
};

export const getTableColumns = (
  table: any[],
  visualization: VisualizationType | undefined,
) => {
  const axisOptions =
    Array.isArray(table) && table[0] ? objectKeys(table[0]) : [];
  return axisOptions.map((col) => {
    const columnValue = visualization?.options?.columns?.find(
      (item: any) => item.id === col,
    );
    if (columnValue) {
      return columnValue;
    }
    return {
      id: col,
      accessorKey: col,
      header: col,
      enableResizing: true,
      size: 100,
      align: 'left',
      type: COLUMN_TYPES.NORMAL,
      format: '',
      coloredPositive: false,
      coloredNegative: false,
      coloredProgress: false,
      isHidden: false,
    } as ColumnDef<unknown>;
  });
};

const VisualizationTable = <T,>({
  data,
  setDataTable,
  visualization,
}: ReactTableProps<T>) => {
  const [newQueryResult, setNewQueryResult] = useState<any[]>(data);
  const table = useReactTable({
    data: newQueryResult,
    columns: getTableColumns(data, visualization),
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

  const columnMaxValues = useMemo((): { [key: string]: number } => {
    console.log(1);
    const columnValues = {} as any;
    const rows = table.getRowModel()?.flatRows;
    if (rows) {
      rows.forEach((row) => {
        row.getVisibleCells().forEach((cell: any) => {
          if (
            cell.column.columnDef.type === COLUMN_TYPES.PROGRESS &&
            cell.column.id
          ) {
            columnValues[cell.column.id] = [
              ...(columnValues[cell.column.id] || []),
              row.original[cell.column.id],
            ];
          }
        });
      });
    }

    return Object.entries(columnValues).reduce((acc, [column, values]: any) => {
      acc[column] = Math.max(...values);
      return acc;
    }, {} as any);
  }, [visualization, data]);

  return (
    <div>
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
                        ) || header.column.columnDef.accessorKey}

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
            {table.getRowModel().rows.map((row, index) => (
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

                  const percent =
                    type === COLUMN_TYPES.PROGRESS
                      ? new BigNumber(value)
                          .dividedBy(
                            new BigNumber(columnMaxValues[cells.column.id]),
                          )
                          .multipliedBy(100)
                          .toNumber()
                      : 0;

                  const checkColor = (value: any) => {
                    switch (true) {
                      case new BigNumber(value).isGreaterThan(0) &&
                        coloredPositive:
                        return VISUALIZATION_COLORS.POSITIVE;
                      case new BigNumber(value).isLessThan(0) &&
                        coloredNegative:
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
                        {type === COLUMN_TYPES.PROGRESS && isNumberValue && (
                          <div
                            style={
                              {
                                '--myColor': coloredProgress
                                  ? VISUALIZATION_COLORS.POSITIVE
                                  : '#3965ff',
                                '--myProgressBar': `${percent}%`,
                              } as React.CSSProperties
                            }
                            className="visual-progressbar"
                          />
                        )}
                        {!!value?.toString() &&
                          formatVisualizationValue(format, value)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <div>
        <TablePagination data={data} onChangeData={setNewQueryResult} />
      </div>
    </div>
  );
};

export default VisualizationTable;
