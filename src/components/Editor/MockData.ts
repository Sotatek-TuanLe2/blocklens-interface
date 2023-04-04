export type SchemaType = {
  blockchains: string[];
  full_name: string;
  id: string;
  namespace: string;
  table_name: string;
  __typename: string;
};

export type TableAttributeType = {
  blockchains: string[];
  column_name: string;
  data_type: string;
  full_name: string;
  id: string;
};

export const duneApiKey =
  'eyJraWQiOiJOU0tDc093eWNEYmc2UDcwb1pcL3lMKzY1NFwvUUhKK0pFVkxISkpWRWtiSlE9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMTljYTMxZS02MDcwLTRlMWItOWE5MS05MWZiZTQwMjIzM2EiLCJldmVudF9pZCI6ImNkMmNlMzZmLTM0OTMtNDIwYS05ODkwLTFlNGQ3ZTFjMWM0ZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NzgzMzI2MDEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTEuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0xX0h5Q1kzc3RoZSIsImV4cCI6MTY3OTMwMjIwMiwiaWF0IjoxNjc5MzAxOTAyLCJqdGkiOiJkYWNlYzQxNy05ZTczLTQ3ZDYtODhhZS1mNjZkNGRlZjQ0ZDAiLCJjbGllbnRfaWQiOiI0M2FjYW1yN2IydWVvamdwZ290djNiajZ1bCIsInVzZXJuYW1lIjoidGhhbmd0biJ9.GJqX6LS__xJJx-d3zpGiSjR-QK7I7RxidRxAxA--7QZEXYYbKMFqCh9nMkpHDxBVa3IU7PpmHoxkNBKzdJo6y7rGylrg1Mfqyg7WcwZPkBItoEB9oxSWlFioJbgDLGQZeifmWx3KcUCchiHvMS4RpOjlHRLf_hEmWRwpAMAfP81Ocg_kHxdtu_f3bWpy0hRKwenqgX6Tu_E4jCeaYIuwY97WJp1ikNSOKkOKAEc-I61XQMhkYbAMDvnzzClNysmqPfAUoM1fWSAwcXEkEXOJAreAg_YkV7Pe8OazZX-U1t3FXTm_4K3LV0-mvYXcw3oZwyXrbaSOLlmj0uavH47tdQ';

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

export const columns = [
  'time',
  'number',
  'gas_limit',
  'gas_used',
  'difficulty',
  'total_difficulty',
  'size',
  'base_fee_per_gas',
  'hash',
  'parent_hash',
  'miner',
  'nonce',
];

export const columnConfigs = columns.map((col) => ({
  id: col,
  accessorKey: col,
  header: col,
  enableResizing: true,
  size: 100,
}));

export const queryValueData = [
  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '1582784',
    hash: '0x79fda1a716575bb120648df87301789c9976c8434fb6aa897d1ae4c5378db359',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b166a',
    number: 76280644,
    parent_hash:
      '0x38a6be2da4a16bffd561aee1344efd78b70cae426a64ba132c55fadcfb53a253',
    size: 702,
    time: '2023-04-02 13:16:38.000 UTC',
    total_difficulty: '54072828',
  },

  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '1527314',
    hash: '0x6631c556d539199970f94fb0ff5d45977799d3e78638dee7850780ebcd2ba1f2',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b1679',
    number: 76281132,
    parent_hash:
      '0xa7d3c2a07de74efc622e86639f2c64689ccfdee8051c03fed5e6b71ff6680bb7',
    size: 676,
    time: '2023-04-02 13:18:37.000 UTC',
    total_difficulty: '54073316',
  },

  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '1527314',
    hash: '0x6631c556d539199970f94fb0ff5d45977799d3e78638dee7850780ebcd2ba1f2',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b1679',
    number: 76281132,
    parent_hash:
      '0xa7d3c2a07de74efc622e86639f2c64689ccfdee8051c03fed5e6b71ff6680bb7',
    size: 678,
    time: '2023-04-02 13:18:37.000 UTC',
    total_difficulty: '54073316',
  },

  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '1357858',
    hash: '0x971e977849eaa9a1e1b89c85dab658e8f574fd58eda4e7a4cd4cf443acb2c685',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b16a1',
    number: 76284376,
    parent_hash:
      '0xc9d2fb21ab500706d966b2548b535a71f94edbc0033d482f85d6c0d8e35912f4',
    size: 682,
    time: '2023-04-02 13:32:02.000 UTC',
    total_difficulty: '54076560',
  },
  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '1185432',
    hash: '0x771876d37f2359e4bf2f081634a8e12232e355b0461db3ddfd2c283c7534efe9',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b16a1',
    number: 76284388,
    parent_hash:
      '0xb15502f8813c3ee485ef60019f3448907007f8ad44b59d8b7520e21b7e90a1cd',
    size: 1198,
    time: '2023-04-02 13:32:05.000 UTC',
    total_difficulty: '54076572',
  },
  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '1697019',
    hash: '0x8103884a9df86f6112d90d0b8059bc6521cae0db6966daa461db69e964bcd1ad',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b16a1',
    number: 76284364,
    parent_hash:
      '0x210fa6b923fc172f843287497d556101902a4808a307e13a97e6b145e1a15c2d',
    size: 1859,
    time: '2023-04-02 13:31:59.000 UTC',
    total_difficulty: '54076548',
  },
  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '1186554',
    hash: '0x51340a8d3f3916044f0f3ceaa1ccb5178f925b9927818e1182a500282891619e',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b16a1',
    number: 76284384,
    parent_hash:
      '0x4900475b5c3feac6319a6dae8fa7e3960192dd0599ac3150ae863e328ea1234c',
    size: 1238,
    time: '2023-04-02 13:32:04.000 UTC',
    total_difficulty: '54076568',
  },
  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '647289',
    hash: '0x483fae87b39a6c587b51bbc877e0f4c1c30482124f389ee92e681a671d3fdd23',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b16a1',
    number: 76284377,
    parent_hash:
      '0x971e977849eaa9a1e1b89c85dab658e8f574fd58eda4e7a4cd4cf443acb2c685',
    size: 941,
    time: '2023-04-02 13:32:03.000 UTC',
    total_difficulty: '54076561',
  },
  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '976731',
    hash: '0x039ec31134188b1cd88af707055deae3572a60475c76f4be0a013d02fc646a65',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b16a1',
    number: 76284397,
    parent_hash:
      '0x893cb8ff2e8c419c9f26664a2748e8e79438a6c34ed28e2b2017908b091820d5',
    size: 1203,
    time: '2023-04-02 13:32:08.000 UTC',
    total_difficulty: '54076581',
  },
  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '802681',
    hash: '0x562040ddb61a1cef7dd4fcf5c5af01926f30dac3d2041105cfc026a55fee1514',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b16a1',
    number: 76284362,
    parent_hash:
      '0xdea36a9e3306445bb25dcd37d944a94e6a663678d4afe54728f5ef4a40e8b61a',
    size: 1051,
    time: '2023-04-02 13:31:59.000 UTC',
    total_difficulty: '54076546',
  },
  {
    base_fee_per_gas: 100000000,
    difficulty: 1,
    gas_limit: '1125899906842624',
    gas_used: '609423',
    hash: '0x8226e4d10f615b4325ac4069ec5e78046445e69118876c145863312205e9e8ac',
    miner: '0xa4b000000000000000000073657175656e636572',
    nonce: '0x00000000000b16a1',
    number: 76284398,
    parent_hash:
      '0x039ec31134188b1cd88af707055deae3572a60475c76f4be0a013d02fc646a65',
    size: 913,
    time: '2023-04-02 13:32:08.000 UTC',
    total_difficulty: '54076582',
  },
];
