import React from 'react';
import 'src/styles/components/QueryResultsPagination.scss';
import AppInput from './AppInput';
import { ArrowDoubleLeftIcon, ArrowDownIcon, PrevIcon } from 'src/assets/icons';

const QueryResultsPagination = () => {
  return (
    <div className="main-pagination">
      <div className="total-record">200 rows</div>
      <div>
        <AppInput size={'xs'} placeholder="Search ..." />
      </div>
      <div className="button-pagination">
        <ArrowDoubleLeftIcon />
      </div>
      <div className="button-pagination">
        <PrevIcon />
      </div>
      <div className="button-pagination">
        <PrevIcon
          style={{
            transform: 'rotate(180deg)',
          }}
        />
      </div>
      <div className="button-pagination">
        <ArrowDoubleLeftIcon
          style={{
            transform: 'rotate(180deg)',
          }}
        />
      </div>
    </div>
  );
};

export default QueryResultsPagination;
