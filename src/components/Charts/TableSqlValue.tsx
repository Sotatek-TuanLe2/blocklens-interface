import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import 'src/styles/components/TableValue.scss';
import ConfigTable from '../SqlEditor/ConfigTable';

interface ReactTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
}
interface IDataForm {
  align: string;
  type: string;
}

const TableSqlValue = <T,>({ data, columns }: ReactTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [dataTable, setDataTable] = useState({ ...table });
  const a = [...dataTable.getHeaderGroups()[0].headers];
  const b = a.map((i) => ({ ...i, scs: 'sscs' }));

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
          {dataTable.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              style={{
                width: 'fit-content',
                // display: 'flex',
              }}
            >
              {b.map((header) => (
                <th
                  {...{
                    key: header.id,
                    style: {
                      width: header.getSize(),
                      boxShadow: 'inset 0 0 0 1px lightgray',
                    },
                  }}
                >
                  {console.log(header.scs)}
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
                              dataTable.getState().columnSizingInfo.deltaOffset
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
          {dataTable.getRowModel().rows.map((row) => (
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
      <ConfigTable table={dataTable} />
    </div>
  );
};

export default TableSqlValue;
