import { FC } from 'react';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import 'src/styles/components/AppPagination.scss';
import { ArrowDownIcon } from '../assets/icons';

const AppPagination: FC<ReactPaginateProps> = ({ ...props }) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={
        <ArrowDownIcon
          style={{
            transform: 'rotate(270deg)',
            cursor:
              props.forcePage === props.pageCount - 1
                ? 'not-allowed'
                : 'pointer',
          }}
        />
      }
      pageRangeDisplayed={2}
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
};
export default AppPagination;
