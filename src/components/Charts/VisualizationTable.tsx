import { Box, Flex } from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import 'src/styles/components/TableValue.scss';
import { INPUT_DEBOUNCE, VISUALIZATION_COLORS } from 'src/utils/common';
import { VisualizationType } from 'src/utils/query.type';
import { formatVisualizationValue } from 'src/utils/utils-format';
import { isNumber } from 'src/utils/utils-helper';
import { objectKeys } from 'src/utils/utils-network';
import AppPagination from '../AppPagination';
import AppInput from '../AppInput';
import { debounce } from 'lodash';

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
  const [itemOffset, setItemOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const ITEMS_PER_PAGE = 15;
  const pageCount = Math.ceil(data.length / ITEMS_PER_PAGE);
  const endOffset = itemOffset + ITEMS_PER_PAGE;

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    INPUT_DEBOUNCE,
  );

  const filteredData = data.filter((item: any) =>
    Object.keys(data[0] as any).some(
      (field) =>
        item[field] &&
        item[field]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim()),
    ),
  );

  const currentItems = filteredData.slice(itemOffset, endOffset);

  const table = useReactTable({
    data: currentItems,
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

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * ITEMS_PER_PAGE) % data.length;
    setItemOffset(newOffset);
  };

  const columnMaxValues = useMemo((): { [key: string]: number } => {
    const columnValues = {} as any;
    const rows = table.getRowModel()?.flatRows;
    if (rows) {
      rows.forEach((row) => {
        row.getVisibleCells().forEach((cell: any) => {
          if (
            cell.column.columnDef.type === COLUMN_TYPES.PROGRESS &&
            cell.column.id
          ) {
            const columnId = cell.column.id as keyof T;
            columnValues[columnId] = [
              ...(columnValues[columnId] || []),
              row.original[columnId],
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
      <div className="header-table">
        <AppInput
          isSearch
          variant="searchFilter"
          size="xs"
          className="input-search"
          type="text"
          placeholder={'Search...'}
          onChange={handleSearch}
        />
      </div>

      <Box className="main-table" height={'308px'} overflow={'auto'}>
        <table
          className={'table-value'}
          {...{
            style: {
              width: '100%',
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
                        paddingLeft: '24px',
                        textTransform: 'uppercase',
                        color: '#465065',
                        width: header.getSize(),
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
                            fontWeight: 400,
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
                          formatVisualizationValue(format, value.toString())}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <Flex
        justifyContent={'flex-end'}
        alignItems={'baseline'}
        className="table-pagination"
      >
        <div className="data-length">{data.length} rows</div>
        <AppPagination pageCount={pageCount} onPageChange={handlePageClick} />
      </Flex>
    </div>
  );
};

export default VisualizationTable;
