export type TableAttributeType = {
  blockchains: string[];
  column_name: string;
  data_type: string;
  full_name: string;
  id: string;
};
export const tableDetail: TableAttributeType[] = [
  {
    blockchains: ['arbitrum'],
    column_name: 'access_list',
    data_type: 'array(row(address varbinary,storageKeys array(varbinary)))',
    full_name: 'arbitrum.transactions',
    id: '11.arbitrum.transactions.access_list.285327',
  },
  {
    blockchains: ['arbitrum'],
    column_name: 'block_hash',
    data_type: 'varbinary',
    full_name: 'arbitrum.transactions',
    id: '11.arbitrum.transactions.block_hash.9c6d44',
  },
  {
    blockchains: ['arbitrum'],
    column_name: 'from',
    data_type: 'varbinary',
    full_name: 'arbitrum.transactions',
    id: '11.arbitrum.transactions.from.b1f70e',
  },
  {
    blockchains: ['arbitrum'],
    column_name: 'gas_price',
    data_type: 'uint256',
    full_name: 'arbitrum.transactions',
    id: '11.arbitrum.transactions.gas_price.dbfd4e',
  },
];
