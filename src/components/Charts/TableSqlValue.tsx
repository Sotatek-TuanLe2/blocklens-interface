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
    (data) => {
      setColumns(
        columns.map((item: any) => (item.id === data.id ? data : item)),
      );
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
                      display: header.column.columnDef.isHidden ? 'none' : null,
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
                  cell,
                  coloredPositive,
                  coloredNegative,
                  type,
                } = cells.column.columnDef;
                const value = cells.getValue();
                const checkColor = (value: any) => {
                  switch (true) {
                    case value > 0 && coloredPositive:
                      return '#006400';
                    case value < 0 && coloredNegative:
                      return '#d93025';
                    default:
                      return null;
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
                          display: isHidden ? 'none' : null,
                          color:
                            typeof value === 'number'
                              ? checkColor(cells.getValue())
                              : null,
                        },
                      }}
                    >
                      {type === 'normal' ? null : (
                        <div className="visual-progressbar"> </div>
                      )}
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
        newColumns={columns}
        updateDataNewTable={updateDataNewTable}
      />
    </div>
  );
};

export default TableSqlValue;
