import { isMobile } from 'react-device-detect';
import { Table, Tbody, Td, Tr } from '@chakra-ui/react';
import React, { FC } from 'react';
import 'src/styles/components/AppLoadingTable.scss';

interface IAppLoadingTable {
  widthColumns: number[];
  rowNumber?: number;
}

const AppLoadingTable: FC<IAppLoadingTable> = ({
  widthColumns,
  rowNumber = 3,
}) => {
  if (isMobile) return null;

  const rowLoadings = [];
  for (let i = 0; i < rowNumber; i++) {
    rowLoadings.push(
      <Tr className="tr-list">
        {widthColumns.map((width: number, index: number) => {
          return (
            <Td w={`${width}%`} key={index}>
              <div className={'skeleton'} />
            </Td>
          );
        })}
      </Tr>,
    );
  }

  return (
    <Table >
      <Tbody>
        {rowLoadings}
      </Tbody>
    </Table>
  );
};

export default AppLoadingTable;