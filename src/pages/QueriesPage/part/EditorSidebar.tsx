import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';
import _, { debounce } from 'lodash';
import moment from 'moment';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import {
  AvatarIcon,
  CheckIcon,
  ClockIcon,
  SettingIcon,
} from 'src/assets/icons';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/EditorSidebar.scss';
import { IQuery } from 'src/utils/query.type';
import { AppInput, AppSelect2 } from '../../../components';
import SchemaDescribe from '../../../components/SqlEditor/SchemaDescribe';
import SchemaTitle from '../../../components/SqlEditor/SchemaTitle';
import { SchemaType, TableAttributeType } from '../../../utils/common';
import { getErrorMessage } from '../../../utils/utils-helper';
import { getLogoChainByChainId } from '../../../utils/utils-network';
import { toastError } from '../../../utils/utils-notify';

const TIME_DEBOUNCE = 1000;
interface IEditerSideBar {
  queryValue: IQuery | null;
}

interface IQueryInfo {
  label: string;
  value: any;
  icon: ReactNode;
  contentRight?: boolean;
}

const defaultQueryInfo: { [key: string]: IQueryInfo } = {
  LAST_SAVED: {
    label: 'Last saved',
    value: '',
    icon: <SettingIcon />,
    contentRight: true,
  },
  QUERY_CREATED: {
    label: 'Query created',
    value: '',
    icon: <ClockIcon />,
    contentRight: true,
  },
  QUERY_PUBLIC: { label: 'Query is', value: '', icon: <AvatarIcon /> },
  QUERY_PUBLISHED: { label: 'Query is', value: '', icon: <CheckIcon /> },
};

const EditorSidebar: React.FC<IEditerSideBar> = ({ queryValue }) => {
  const [tableSelected, setTableSelected] = useState<{
    chain: string;
    name: string;
    fullName: string;
  } | null>(null);
  const [schemas, setSchemas] = useState<TableAttributeType[]>([]);
  const [paramsSearch, setParamsSearch] = useState({
    namespace: '',
    search: '',
  });
  const [schemaDescribe, setSchemaDescribe] = useState<SchemaType[] | null>();
  const [queryInfo, setQueryInfo] = useState(defaultQueryInfo);
  const [chainsSupported, setChainsSupported] = useState<
    { value: string; label: string }[]
  >([]);
  console.log('paramsSearch', paramsSearch);
  useEffect(() => {
    (async () => {
      const listChainRes = await rf
        .getRequest('DashboardsRequest')
        .getSupportedChains();

      const listChain = listChainRes.map((chain: string) => ({
        value: chain,
        label: chain.replaceAll('_', ' ').toUpperCase(),
      }));
      setChainsSupported(listChain);
    })();
  }, []);

  const selectSchemaTitleHandler = async ({
    chain,
    name,
    fullName,
  }: {
    chain: string;
    name: string;
    fullName: string;
  }) => {
    setTableSelected({ chain, name, fullName });
    try {
      const data = await rf.getRequest('DashboardsRequest').getSchemaOfTable({
        namespace: chain,
        tableName: name,
      });
      setSchemaDescribe(data);
      //get schema
    } catch (error) {
      console.log('error', error);
    }
  };
  const clickBackIconHandler = () => {
    setTableSelected(null);
    setSchemaDescribe(null);
  };

  const fetchDataTable = async () => {
    try {
      const params = _.omitBy({ ...paramsSearch }, (v) => v === '');
      const tables = await rf.getRequest('DashboardsRequest').getTables(params);
      setSchemas(tables);
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  };

  const debounceFetchTablaData = useCallback(
    debounce(fetchDataTable, TIME_DEBOUNCE),
    [paramsSearch],
  );

  useEffect(() => {
    setQueryInfo((pre) => ({
      LAST_SAVED: {
        ...queryInfo.LAST_SAVED,
        value: moment(queryValue?.updatedAt).fromNow(),
      },
      QUERY_CREATED: {
        ...queryInfo.QUERY_CREATED,
        value: moment(queryValue?.createdAt).fromNow(),
      },
      QUERY_PUBLIC: {
        ...queryInfo.QUERY_PUBLIC,
        value: queryValue?.isPrivate ? 'public' : 'private',
      },
      QUERY_PUBLISHED: {
        ...queryInfo.QUERY_PUBLISHED,
        value: queryValue?.isTemp ? 'keeped' : 'published',
      },
    }));
  }, [queryValue]);

  useEffect(() => {
    debounceFetchTablaData();
    return () => {
      debounceFetchTablaData.cancel();
    };
  }, [debounceFetchTablaData]);

  const renderTableDescribe = () => {
    return (
      tableSelected &&
      schemaDescribe && (
        <SchemaDescribe
          tableDescribe={schemaDescribe}
          blockchain={tableSelected?.chain}
          name={tableSelected.name}
          fullName={tableSelected.fullName}
        />
      )
    );
  };

  const renderListSchema = () => {
    return (
      !tableSelected && (
        <Box className="list-schema custom-scroll">
          {!!schemas.length &&
            schemas.map((schema, index) => (
              <Box key={index + 'list-schema'}>
                <SchemaTitle
                  chainName={schema.namespace}
                  tableName={schema.table_name}
                  tableFullName={schema.full_name}
                  className={'row-element'}
                  onClick={() =>
                    selectSchemaTitleHandler({
                      chain: schema.namespace,
                      name: schema.table_name,
                      fullName: schema.full_name,
                    })
                  }
                />
              </Box>
            ))}
        </Box>
      )
    );
  };

  const handleChangeChainSelect = (value: any) => {
    setParamsSearch((pre) => ({ ...pre, namespace: value }));
  };

  const handleFilterTable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParamsSearch((pre) => ({ ...pre, search: e.target.value }));
  };

  const renderHeaderRawTable = () => {
    return (
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Box className={'dataset-title'}></Box>
        <Box className="select-chains">
          <AppSelect2
            value={paramsSearch.namespace}
            options={[{ label: 'All chains', value: '' }, ...chainsSupported]}
            onChange={handleChangeChainSelect}
          />
        </Box>
      </Flex>
    );
  };
  return (
    <Box className="editor-sidebar-wrap" width={'100%'} maxW={'380px'}>
      <Box className="editor-sidebar">
        <AppInput
          value={paramsSearch.search}
          marginBottom={4}
          placeholder={'Filter tables...'}
          size="md"
          onChange={(e) => handleFilterTable(e)}
        />
        <Box marginBottom={4}>
          {tableSelected ? (
            <Flex alignItems={'center'}>
              <Flex
                className="header-table"
                alignItems={'center'}
                onClick={clickBackIconHandler}
              >
                <ArrowBackIcon />
                <Box className={getLogoChainByChainId('ETH')} marginLeft={2} />
                <Text ml={2}>{tableSelected?.chain}</Text>
                <Text ml={2}>{tableSelected?.name}</Text>
              </Flex>
            </Flex>
          ) : (
            renderHeaderRawTable()
          )}
        </Box>
        {renderListSchema()}
        {renderTableDescribe()}
      </Box>
      {!!queryValue && !queryValue?.isTemp && (
        <Flex direction={'column'} className="query-info-wrap">
          {Object.values(queryInfo).map((query, id) => (
            <Flex
              key={id + 'query_info'}
              className="query-info"
              justifyContent={query.contentRight ? 'space-between' : 'left'}
            >
              <Flex alignItems={'center'} gap={'6px'}>
                <span>{query.icon}</span>
                <Box className="query-info__label">{query.label} &nbsp;</Box>
              </Flex>

              <Box
                className="query-info__value"
                fontStyle={query.contentRight ? 'italic' : 'normal'}
              >
                {query.value}
              </Box>
            </Flex>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default EditorSidebar;
