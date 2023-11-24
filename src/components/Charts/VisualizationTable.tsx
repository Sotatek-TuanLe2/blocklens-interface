import { Box, Flex, Skeleton, Tooltip } from '@chakra-ui/react';
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
import {
  formatShortAddress,
  formatVisualizationValue,
} from 'src/utils/utils-format';
import { isNumber } from 'src/utils/utils-helper';
import { objectKeys } from 'src/utils/utils-network';
import AppPagination from '../AppPagination';
import AppInput from '../AppInput';
import { debounce, isNull, isUndefined, uniq } from 'lodash';
import { Visualization } from 'src/utils/utils-query';

interface ReactTableProps<T> {
  data: T[];
  setDataTable?: React.Dispatch<React.SetStateAction<any[]>>;
  visualization: VisualizationType;
  editMode?: boolean;
  isLoading?: boolean;
}

export const TABLE_COLUMN_TYPES = {
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
      type: TABLE_COLUMN_TYPES.NORMAL,
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
  editMode,
  isLoading,
}: ReactTableProps<T>) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pagination, setPagination] = useState(0);

  const ITEMS_PER_PAGE = 15;

  const visualizationClass = useMemo(
    () => new Visualization(visualization),
    [visualization],
  );

  const tableData = useMemo(() => {
    if (
      !visualizationClass ||
      !visualizationClass.getConfigs().columns ||
      !visualizationClass.getConfigs().columns.length
    ) {
      return data;
    }
    const formatColumns: { [key: string]: string } = {};
    visualizationClass.getConfigs().columns.forEach((item: any) => {
      if (item.format) {
        formatColumns[item.id] = item.format;
      }
    });

    const result = JSON.parse(JSON.stringify(data));
    return result.map((item: any) => {
      if (isNull(item) || isUndefined(item)) {
        return item;
      }
      objectKeys(formatColumns).forEach((col) => {
        item[col] = formatColumns[col]
          ? formatVisualizationValue(formatColumns[col], item[col])
          : item[col];
      });
      return item;
    });
  }, [data, visualization]);

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return tableData;
    }
    return tableData.filter((item: any) =>
      Object.keys(data[0] as any).some(
        (field) =>
          item[field] &&
          item[field]
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()),
      ),
    );
  }, [tableData, searchTerm]);

  const pageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const endOffset = itemOffset + ITEMS_PER_PAGE;

  const currentItems = useMemo(
    () => filteredData.slice(itemOffset, endOffset),
    [filteredData, itemOffset, endOffset],
  );

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

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setPagination(0);
      setItemOffset(0);
    },
    INPUT_DEBOUNCE,
  );

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * ITEMS_PER_PAGE) % data.length;
    setItemOffset(newOffset);
    setPagination(event.selected);
  };

  const columnMaxValues = useMemo((): { [key: string]: number } => {
    const columnValues: { [columnId: string]: any[] } = {};
    const progressColumns: { [columnId: string]: boolean } = {};
    table.getAllFlatColumns().forEach((column: any) => {
      if (column.columnDef.type === TABLE_COLUMN_TYPES.PROGRESS && column.id) {
        progressColumns[column.id] = true;
      }
    });

    if (!!data.length) {
      data.forEach((item: any) => {
        objectKeys(progressColumns).forEach((columnId) => {
          if (!isNaN(item[columnId]) || !isUndefined(item[columnId])) {
            columnValues[columnId] = [
              ...(columnValues[columnId] || []),
              item[columnId],
            ];
            columnValues[columnId] = uniq(columnValues[columnId]);
          }
        });
      });
    }

    return Object.entries(columnValues).reduce((acc, [column, values]: any) => {
      acc[column] = BigNumber.max(...values).toNumber();
      return acc;
    }, {} as any);
  }, [visualization, data]);

  const formatCellValue = (value: string) => {
    return value.length > 50 ? formatShortAddress(value, 10) : value;
  };

  const alignClass = (align: string) => {
    return align === 'right'
      ? 'right-column'
      : align === 'center'
      ? 'center-column'
      : '';
  };

  const _renderLoadingTable = () => (
    <table
      className={'table-value'}
      {...{
        style: {
          width: '100%',
        },
      }}
    >
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i}>
            {[...Array(4)].map((_, j) => (
              <td key={j} style={{ padding: '0 24px' }}>
                <Skeleton
                  w={j === 0 ? '140px' : '80px'}
                  h={'14px'}
                  rounded={'7px'}
                  my={'10px'}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const _renderTableHeader = () => (
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
              className={`${alignClass(header.column.columnDef.align)}`}
              {...{
                key: header.id,
                style: {
                  color: 'rgba(0, 2, 36, 0.8)',
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
  );

  const _renderTableBody = () => {
    if (!table.getRowModel().rows?.length) {
      return (
        <Flex
          justifyContent={'center'}
          alignItems={'center'}
          className="table-nodata"
        >
          No data...
        </Flex>
      );
    }

    return (
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
                coloredProgress,
              } = cells.column.columnDef;
              const value = cells.getValue();
              const isNumberValue = isNumber(value);

              const percent =
                type === TABLE_COLUMN_TYPES.PROGRESS
                  ? new BigNumber(value)
                      .dividedBy(
                        new BigNumber(columnMaxValues[cells.column.id]),
                      )
                      .multipliedBy(100)
                      .toNumber()
                  : 0;

              const checkColor = (value: any) => {
                if (new BigNumber(value).isGreaterThan(0) && coloredPositive) {
                  return VISUALIZATION_COLORS.POSITIVE;
                }
                if (new BigNumber(value).isLessThan(0) && coloredNegative) {
                  return VISUALIZATION_COLORS.NEGATIVE;
                }
                return undefined;
              };

              const checkProgressColor = (value: any) => {
                if (!coloredProgress) {
                  return '#00022480';
                }
                return new BigNumber(value).isLessThan(0)
                  ? VISUALIZATION_COLORS.NEGATIVE
                  : VISUALIZATION_COLORS.POSITIVE;
              };

              return (
                <td
                  className={`${alignClass(align)}`}
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
                        justifyContent:
                          type === TABLE_COLUMN_TYPES.NORMAL ? align : '',
                        color: isNumberValue
                          ? checkColor(cells.getValue())
                          : undefined,
                        flexDirection:
                          type === TABLE_COLUMN_TYPES.PROGRESS &&
                          align === 'right'
                            ? 'row-reverse'
                            : 'row',
                        gap:
                          type === TABLE_COLUMN_TYPES.PROGRESS &&
                          align === 'right'
                            ? '10px'
                            : '',
                      },
                    }}
                  >
                    {type === TABLE_COLUMN_TYPES.PROGRESS && isNumberValue && (
                      <div
                        style={
                          {
                            '--myColor': checkProgressColor(value),
                            '--myProgressBar': `${percent}%`,
                          } as React.CSSProperties
                        }
                        className="visual-progressbar"
                      />
                    )}
                    {!isNull(value) && !isUndefined(value) && (
                      <Tooltip hasArrow label={value.toString()} as="div">
                        <div>{formatCellValue(value.toString())}</div>
                      </Tooltip>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <>
      <div className={`header-table ${editMode ? 'editMode' : ''}`}>
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
      <Box
        className="main-table"
        style={
          {
            '--bg-copyright':
              !isLoading && 'url(/images/copyright-logo-name.png)',
          } as any
        }
      >
        {isLoading ? (
          _renderLoadingTable()
        ) : (
          <table
            className={'table-value'}
            {...{
              style: {
                width: '100%',
              },
            }}
          >
            {_renderTableHeader()}
            {_renderTableBody()}
          </table>
        )}
      </Box>
      {filteredData?.length > ITEMS_PER_PAGE && (
        <Flex
          align={'baseline'}
          justify={{ base: 'space-between', lg: 'flex-end' }}
          className="table-pagination"
        >
          <div className="data-length">{filteredData?.length} rows</div>
          <AppPagination
            pageCount={pageCount}
            forcePage={pagination}
            onPageChange={handlePageClick}
          />
        </Flex>
      )}
    </>
  );
};

export default VisualizationTable;
