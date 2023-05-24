import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';
import _, { debounce } from 'lodash';
import moment from 'moment';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CheckIcon, ClockIcon, SettingIcon } from 'src/assets/icons';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/EditorSidebar.scss';
import { IQuery } from 'src/utils/query.type';
import { Query } from 'src/utils/utils-query';
import { AppInput, AppSelect2 } from '../../../components';
import SchemaDescribe from '../../../components/SqlEditor/SchemaDescribe';
import SchemaTitle from '../../../components/SqlEditor/SchemaTitle';
import { SchemaType, TableAttributeType } from '../../../utils/common';
import { getErrorMessage } from '../../../utils/utils-helper';
import { getChainIconByChainName } from '../../../utils/utils-network';
import { toastError } from '../../../utils/utils-notify';

const TIME_DEBOUNCE = 1000;
interface IExploreDataProps {
  queryValue: IQuery | null;
  onAddParameter: (parameter: string) => void;
}

interface IQueryInfo {
  label: string;
  value: any;
  icon: ReactNode;
  contentRight?: boolean;
}

const ExploreData: React.FC<IExploreDataProps> = ({
  queryValue,
  onAddParameter,
}) => {
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
  const [chainsSupported, setChainsSupported] = useState<
    { value: string; label: string }[]
  >([]);

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

  const queryClass = useMemo(() => {
    if (!queryValue) {
      return null;
    }
    return new Query(queryValue);
  }, [queryValue]);

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
          onAddParameter={onAddParameter}
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
                isTruncated
              >
                <ArrowBackIcon mr={2} />
                <div>{getChainIconByChainName(tableSelected?.chain)}</div>
                <Text isTruncated ml={2} title={tableSelected?.chain}>
                  {tableSelected?.chain}
                </Text>
                <Text isTruncated ml={2} title={tableSelected?.name}>
                  {tableSelected?.name}
                </Text>
              </Flex>
            </Flex>
          ) : (
            renderHeaderRawTable()
          )}
        </Box>
        {renderListSchema()}
        {renderTableDescribe()}
      </Box>
      {!!queryClass && !queryClass.isTemp() && (
        <Flex direction={'column'} className="query-info-wrap">
          {(
            [
              {
                label: 'Last saved',
                value: moment(queryClass.getUpdatedTime()).fromNow(),
                icon: <SettingIcon />,
                contentRight: true,
              },
              {
                label: 'Query created',
                value: moment(queryClass.getCreatedTime()).fromNow(),
                icon: <ClockIcon />,
                contentRight: true,
              },
              {
                label: 'Query is',
                value: queryClass.isTemp() ? 'keeped' : 'published',
                icon: <CheckIcon />,
              },
            ] as IQueryInfo[]
          ).map((info, id) => (
            <Flex
              key={id + 'query_info'}
              className="query-info"
              justifyContent={info.contentRight ? 'space-between' : 'left'}
            >
              <Flex alignItems={'center'} gap={'6px'}>
                <span>{info.icon}</span>
                <Box className="query-info__label">{info.label} &nbsp;</Box>
              </Flex>

              <Box
                className="query-info__value"
                fontStyle={info.contentRight ? 'italic' : 'normal'}
              >
                {info.value}
              </Box>
            </Flex>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default ExploreData;
