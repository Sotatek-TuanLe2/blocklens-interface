import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import 'src/styles/components/TableValue.scss';
import ConfigTable from '../SqlEditor/ConfigTable';

interface ReactTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
}

const TableSqlValue = <T,>({
  data,
  columns: dataColumn,
}: ReactTableProps<T>) => {
  const [columns, setColumns] = useState<ColumnDef<T, unknown>[]>(dataColumn);
  useEffect(() => {
    setColumns(dataColumn);
  }, [dataColumn]);
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const updateDataNewTable = useCallback(
    (data: ColumnDef<T, unknown>) => {
      setColumns(columns.map((item) => (item.id === data.id ? data : item)));
    },
    [columns],
  );
  return (
    <div>
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
              {row.getVisibleCells().map((cells) => {
                const {
                  align,
                  isHidden,
                  coloredPositive,
                  coloredNegative,
                  type,
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
                      {value}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <ConfigTable
        newColumns={columns as typeof columns}
        updateDataNewTable={updateDataNewTable}
        table={table}
      />
    </div>
  );
};

export default TableSqlValue;
