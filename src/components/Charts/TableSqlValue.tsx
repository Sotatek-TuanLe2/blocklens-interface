import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import 'src/styles/components/TableValue.scss';
import ConfigTable from '../SqlEditor/ConfigTable';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

interface ReactTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
}

const TableSqlValue = <T,>({ data, columns }: ReactTableProps<T>) => {
  const newColumns = columns.map((i) => {
    return {
      ...i,
      align: 'left',
      type: 'normal',
      coloredPositive: false,
      coloredNegative: false,
    };
  });
  const table = useReactTable({
    data,
    columns: newColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [dataTable, setDataTable] = useState(table);

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
              {headerGroup.headers.map((header) => (
                <th
                  {...{
                    key: header.id,
                    style: {
                      textAlign: header.column.columnDef.align,
                      width: header.getSize(),
                      boxShadow: 'inset 0 0 0 1px lightgray',
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
              {row.getVisibleCells().map((cell) => (
                <td
                  {...{
                    key: cell.id,
                    style: {
                      width: cell.column.getSize(),
                    },
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ConfigTable table={dataTable} setDataTable={setDataTable} />
    </div>
  );
};

export default TableSqlValue;
