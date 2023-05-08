import React, { useEffect, useState } from 'react';
import { ArrowDoubleLeftIcon, PrevIcon } from 'src/assets/icons';
import 'src/styles/components/QueryResultsPagination.scss';
import AppInput from '../AppInput';
import AppButton from '../AppButton';
import { debounce } from 'lodash';

const TablePagination = ({ data, onChangeData }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const ROWS_PER_PAGE = 15;
  const DEBOUNCE_TIME = 500;

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(Math.ceil(data.length / ROWS_PER_PAGE));
  };
  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    DEBOUNCE_TIME,
  );

  const lastIndex = currentPage * ROWS_PER_PAGE;
  const firstIndex = lastIndex - ROWS_PER_PAGE;
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const filteredData = data.filter((item: { [x: string]: string }) =>
    Object.keys(data[0]).some(
      (field) =>
        item[field] &&
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );
  const displayedItems = filteredData.slice(firstIndex, lastIndex);

  useEffect(() => {
    onChangeData(displayedItems);
  }, [lastIndex, firstIndex, searchTerm]);

  return (
    <div className="main-pagination">
      <div className="total-record">{data.length} rows</div>
      <div>
        <AppInput
          size={'xs'}
          placeholder="Search ..."
          onChange={handleSearch}
        />
      </div>
      <div
        className={`group-button ${
          filteredData.length < ROWS_PER_PAGE && 'hidden-button'
        } `}
      >
        <AppButton
          size={'sm'}
          className="button-pagination"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          <ArrowDoubleLeftIcon />
        </AppButton>
        <AppButton
          size={'sm'}
          className="button-pagination"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <PrevIcon />
        </AppButton>
        <select
          className="total-pages"
          value={currentPage}
          onChange={(event) => {
            const newPage = event.target.value;
            setCurrentPage(+newPage);
          }}
        >
          {pages.map((i) => (
            <option key={i} value={i}>
              Page {i}
            </option>
          ))}
        </select>
        <AppButton
          size={'sm'}
          className="button-pagination"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <PrevIcon
            style={{
              transform: 'rotate(180deg)',
            }}
          />
        </AppButton>
        <AppButton
          size={'sm'}
          className="button-pagination"
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        >
          <ArrowDoubleLeftIcon
            style={{
              transform: 'rotate(180deg)',
            }}
          />
        </AppButton>
      </div>
    </div>
  );
};

export default TablePagination;
