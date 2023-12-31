import { FC } from 'react';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import 'src/styles/components/AppPagination.scss';
import { ArrowDownIcon } from '../assets/icons';
import { isMobile } from 'react-device-detect';

const AppPagination: FC<ReactPaginateProps> = (props) => (
  <ReactPaginate
    breakLabel="..."
    nextLabel={
      <ArrowDownIcon
        style={{
          transform: 'rotate(270deg)',
          cursor:
            props.forcePage === props.pageCount - 1 ? 'not-allowed' : 'pointer',
        }}
      />
    }
    pageRangeDisplayed={isMobile ? 1 : 2}
    marginPagesDisplayed={isMobile ? 1 : 2}
    previousLabel={
      <ArrowDownIcon
        style={{
          transform: 'rotate(90deg)',
          cursor: props.forcePage === 0 ? 'not-allowed' : 'pointer',
        }}
      />
    }
    className="app-pagination"
    {...props}
  />
);
export default AppPagination;
