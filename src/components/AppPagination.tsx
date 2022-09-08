import { FC } from 'react';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import 'src/styles/components/AppPagination.scss';
import { ArrowDownIcon } from '../assets/icons';

const AppPagination: FC<ReactPaginateProps> = ({ ...props }) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<ArrowDownIcon style={{ transform: 'rotate(270deg)' }} />}
      pageRangeDisplayed={2}
      previousLabel={<ArrowDownIcon style={{ transform: 'rotate(90deg)' }} />}
      className="app-pagination"
      {...props}
    />
  );
};
export default AppPagination;
