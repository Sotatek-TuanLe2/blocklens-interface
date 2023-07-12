import { Box, Collapse, Flex, Spinner, Text, Tooltip } from '@chakra-ui/react';
import _, { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { CloseMenuIcon, CopyIcon } from 'src/assets/icons';
import { AppInput } from 'src/components';
import AppQueryMenu, { QUERY_MENU_LIST } from 'src/components/AppQueryMenu';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import rf from 'src/requests/RequestFactory';
import { IPagination, ROUTES, SchemaType } from 'src/utils/common';
import { IQuery } from 'src/utils/query.type';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { copyToClipboard } from 'src/utils/utils-helper';
import { getChainIconByChainName } from 'src/utils/utils-network';
import { BROADCAST_FETCH_DASHBOARD } from './Dashboard';
import { BROADCAST_FETCH_QUERY } from './Query';

export const BROADCAST_FETCH_WORKPLACE_DATA = 'FETCH_WORKPLACE_DATA';

const ChainItem = ({
  chain,
  onChangeSchemaDescribe,
  schemaDescribe,
}: {
  chain: SchemaType;
  onChangeSchemaDescribe: React.Dispatch<React.SetStateAction<SchemaType[]>>;
  schemaDescribe: SchemaType[];
}) => {
  const { pathname } = useLocation();

  const handleToggle = async () => {
    try {
      const data = await rf.getRequest('DashboardsRequest').getSchemaOfTable({
        namespace: chain.namespace,
        tableName: chain.table_name,
      });
      onChangeSchemaDescribe(data);
      //get schema
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyQuery = (query: string) => {
    copyToClipboard(query);
  };

  return (
    <>
      <Box display={'flex'} onClick={handleToggle} className="chain-info-title">
        <Flex flex={1} maxW={'80%'} gap="10px">
          <div
            className={
              schemaDescribe.length &&
              schemaDescribe[0]?.table_name === chain.table_name
                ? 'bg-chain_active'
                : 'bg-chain_default'
            }
          />
          <Tooltip placement={'top'} hasArrow label={chain.table_name} p={2}>
            <Text isTruncated maxW={'70%'}>
              {chain.table_name}
            </Text>
          </Tooltip>
        </Flex>
        {pathname.includes(ROUTES.MY_QUERY) && (
          <Tooltip
            placement="top"
            hasArrow
            label="Copy query"
            aria-label="A tooltip"
            borderRadius="6px"
          >
            <div
              className="add-query-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyQuery(chain.full_name);
              }}
            >
              <CopyIcon />
            </div>
          </Tooltip>
        )}
      </Box>
    </>
  );
};

const CollapseExplore = ({
  title,
  content,
  onChangeSchemaDescribe,
  schemaDescribe,
}: {
  title: string;
  content: SchemaType[];
  onChangeSchemaDescribe: React.Dispatch<React.SetStateAction<SchemaType[]>>;
  schemaDescribe: SchemaType[];
}) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <>
      <Box
        isTruncated
        className="workspace-page__sidebar__content__explore-wrap__content"
        onClick={handleToggle}
      >
        <Flex alignItems={'center'} gap="10px">
          <div className={getChainIconByChainName(content[0].namespace)}></div>
          <span>{title.toUpperCase()}</span>
        </Flex>
        <div className={show ? 'bg-arrow_icon collapsed' : 'bg-arrow_icon'} />
      </Box>

      <Collapse
        animateOpacity
        in={show}
        className="workspace-page__sidebar__content__explore-wrap__content-collapse"
      >
        {content.map((chain: SchemaType, index: number) => {
          return (
            <ChainItem
              chain={chain}
              key={index + 'chain'}
              onChangeSchemaDescribe={onChangeSchemaDescribe}
              schemaDescribe={schemaDescribe}
            />
          );
        })}
      </Collapse>
    </>
  );
};

const Sidebar: React.FC<{
  expandSidebar: boolean;
  onToggleExpandSidebar: (toggle?: boolean) => void;
}> = ({ expandSidebar, onToggleExpandSidebar }) => {
  const CATEGORIES = {
    WORK_PLACE: 'WORK_PLACE',
    EXPLORE_DATA: 'EXPLORE_DATA',
  };

  const categoryList: {
    id: string;
    title: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
  }[] = [
    {
      id: CATEGORIES.EXPLORE_DATA,
      title: 'Explore data',
      icon: (
        <Tooltip
          placement="right"
          hasArrow
          label="Explore data"
          bg="white"
          borderRadius="6px"
          color="black"
        >
          <div className="icon-explore-light" />
        </Tooltip>
      ),
      activeIcon: <div className="bg-explore_active" />,
    },
    {
      id: CATEGORIES.WORK_PLACE,
      title: 'Work place',
      icon: (
        <Tooltip
          placement="right"
          hasArrow
          label="Work place"
          bg="white"
          borderRadius="6px"
          color="black"
        >
          <div className="icon-place-light" />
        </Tooltip>
      ),
      activeIcon: <div className="bg-work_place_active" />,
    },
  ];

  const { queryId, dashboardId }: { queryId?: string; dashboardId?: string } =
    useParams();
  const history = useHistory();
  const { pathname } = useLocation();

  const [category, setCategory] = useState<string>(CATEGORIES.EXPLORE_DATA);
  const [searchValueWorkPlace, setSearchValueWorkPlace] = useState<string>('');
  const [searchExploreData, setSearchExploreData] = useState<string>('');
  const [dataQueries, setDataQueries] = useState<IQuery[] | []>([]);
  const [exploreData, setExploreData] = useState<{
    [key: string]: any;
  }>({});
  const [schemaDescribe, setSchemaDescribe] = useState<SchemaType[]>([]);
  const [dataQueriesPagination, setDataQueriesPagination] = useState<
    IPagination | undefined
  >();

  useEffect(() => {
    AppBroadcast.on(BROADCAST_FETCH_WORKPLACE_DATA, fetchDataWorkPlace);

    return () => {
      AppBroadcast.remove(BROADCAST_FETCH_WORKPLACE_DATA);
    };
  }, []);

  const fetchQueries = async (params = {}) => {
    try {
      const res: any = await rf
        .getRequest('DashboardsRequest')
        .getMyListQueries(params);
      return { ...res, docs: res.data };
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInfiniteScrollQueries = async () => {
    try {
      const res = await fetchQueries(
        _.omitBy(
          {
            search: searchValueWorkPlace.trim(),
            page: (dataQueriesPagination?.currentPage || 1) + 1,
          },
          (param) => !param,
        ),
      );

      const { currentPage, itemsPerPage, totalPages }: IPagination = res;
      setDataQueriesPagination({ currentPage, itemsPerPage, totalPages });
      setDataQueries((pre) => [...pre, ...res.docs]);
    } catch (error) {}
  };

  const fetchDataWorkPlace = async (search?: string) => {
    try {
      const res = await fetchQueries(
        _.omitBy({ search, limit: 40 }, (param) => !param),
      );
      setDataQueries(res.docs);

      if (res.docs) {
        const dataPaginationQueries = {
          currentPage: res.currentPage,
          itemsPerPage: res.itemsPerPage,
          totalPages: res.totalPages,
        };

        setDataQueriesPagination(dataPaginationQueries);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataExploreData = async (search?: string) => {
    try {
      const tables = await rf
        .getRequest('DashboardsRequest')
        .getTables(_.omitBy({ search }, (param) => !param));

      const listChain = _.groupBy(
        tables,
        (item) => item.namespace.split('_')[0],
      );
      setExploreData(listChain);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataWorkPlace();
    fetchDataExploreData();
  }, []);

  const getDataSearchWorkPlace = useCallback(
    debounce(async (search) => {
      fetchDataWorkPlace(search.trim());
    }, 500),
    [],
  );

  const getDataSearchExploreData = useCallback(
    debounce(async (search) => {
      fetchDataExploreData(search.trim());
    }, 500),
    [],
  );

  const handleCreateNewQuery = () => {
    history.push(ROUTES.MY_QUERY);
  };

  const getWorkplaceItemClassname = (id: string) => {
    return id === queryId || id === dashboardId
      ? 'workspace-page__sidebar__content__work-place-detail work-place-active '
      : 'workspace-page__sidebar__content__work-place-detail ';
  };

  const handleCopyQuery = (query: string) => {
    copyToClipboard(query);
  };

  const onForkSuccess = async (response: any, type: string) => {
    await fetchDataWorkPlace();
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? AppBroadcast.dispatch(BROADCAST_FETCH_DASHBOARD, response.id)
      : AppBroadcast.dispatch(BROADCAST_FETCH_QUERY, response.id);
  };

  const _renderNoData = () => (
    <Box pl="16px" className="data-empty">
      No data...
    </Box>
  );

  const _renderContentWorkPlace = () => {
    return (
      <Box className="workspace-page__sidebar__content__work-place-wrap">
        <div className="workspace-page__sidebar__content__work-place-wrap__work-place">
          <span>work place</span>
          <Box
            cursor={'pointer'}
            onClick={() => onToggleExpandSidebar()}
            className="icon-close-light"
          ></Box>
        </div>
        <Box px={'16px'}>
          <AppInput
            className="workspace-page__sidebar__content__work-place-wrap__input-search"
            value={searchValueWorkPlace}
            placeholder={'Search...'}
            size="sm"
            onChange={(e) => {
              setSearchValueWorkPlace(e.target.value);
              getDataSearchWorkPlace(e.target.value);
            }}
          />
        </Box>

        <div className="workspace-page__sidebar__content__work-place-wrap__work-place-content">
          <span>Query</span>{' '}
          <div onClick={handleCreateNewQuery}>
            <Tooltip
              placement="top"
              hasArrow
              label="Add to query"
              aria-label="A tooltip"
              bg="white"
              borderRadius="6px"
              color="black"
            >
              <Box cursor={'pointer'} className="icon-plus-light" />
            </Tooltip>
          </div>
        </div>
        {!!dataQueries.length ? (
          <div
            className="workspace-page__sidebar__content__work-place-wrap__list-query"
            id={'scrollableDivQueries'}
          >
            <InfiniteScroll
              className="infinite-scroll"
              scrollThreshold={1}
              dataLength={dataQueries.length}
              next={fetchInfiniteScrollQueries}
              hasMore={
                (dataQueriesPagination?.currentPage || 0) <
                (dataQueriesPagination?.totalPages || 0)
              }
              loader={
                <Flex justifyContent={'center'}>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="md"
                  />
                </Flex>
              }
              scrollableTarget="scrollableDivQueries"
            >
              {dataQueries.map((query) => (
                <div
                  key={query.id}
                  className={getWorkplaceItemClassname(query.id)}
                >
                  <Tooltip
                    placement="top"
                    hasArrow
                    label={query.name}
                    aria-label="A tooltip"
                    bg="white"
                    borderRadius="6px"
                    color="black"
                  >
                    <Flex
                      isTruncated
                      alignItems={'center'}
                      gap="10px"
                      maxW={'70%'}
                    >
                      <div>
                        <div
                          className={
                            query.id === queryId
                              ? 'bg-query_active'
                              : 'bg-LogoQueryIcon'
                          }
                        />
                      </div>
                      <Text isTruncated>
                        <Link to={`${ROUTES.MY_QUERY}/${query.id}?`}>
                          {query.name}
                        </Link>
                      </Text>
                    </Flex>
                  </Tooltip>
                  <AppQueryMenu
                    menu={[
                      // QUERY_MENU_LIST.FORK,
                      QUERY_MENU_LIST.DELETE,
                    ]}
                    itemType={LIST_ITEM_TYPE.QUERIES}
                    item={query}
                    onForkSuccess={onForkSuccess}
                  />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        ) : (
          _renderNoData()
        )}
      </Box>
    );
  };

  const _renderContentExplore = () => {
    return (
      <div className="workspace-page__sidebar__content__explore-wrap">
        <div className="workspace-page__sidebar__content__explore-wrap__title">
          <span>Explore data</span>
          <Box
            cursor={'pointer'}
            onClick={() => onToggleExpandSidebar()}
            className="bg-CloseBtnIcon"
          />
        </div>
        <Box px={'16px'} mb={'26px'}>
          <AppInput
            className="workspace-page__sidebar__content__work-place-wrap__input-search"
            value={searchExploreData}
            placeholder={'Search...'}
            size="sm"
            onChange={(e) => {
              setSearchExploreData(e.target.value);
              getDataSearchExploreData(e.target.value);
            }}
          />
        </Box>
        {!!Object.keys(exploreData).length ? (
          <div
            className={`${
              !!schemaDescribe.length
                ? 'workspace-page__sidebar__content__explore-wrap__list-chain-half'
                : 'workspace-page__sidebar__content__explore-wrap__list-chain'
            }`}
          >
            {Object.keys(exploreData).map((nameChain: string, index) => (
              <CollapseExplore
                key={index + 'explore'}
                title={nameChain}
                content={Object.values(exploreData)[index]}
                onChangeSchemaDescribe={setSchemaDescribe}
                schemaDescribe={schemaDescribe}
              />
            ))}
          </div>
        ) : (
          _renderNoData()
        )}

        {!!schemaDescribe.length && (
          <Box className="chain-info-desc">
            <div className="chain-info-desc__header">
              <Tooltip
                placement={'top'}
                hasArrow
                label={schemaDescribe[0].table_name}
                p={2}
              >
                <Text isTruncated maxW={'70%'}>
                  {schemaDescribe[0].table_name}
                </Text>
              </Tooltip>
              <div className="header-icon">
                {pathname.includes(ROUTES.MY_QUERY) && (
                  <div
                    onClick={() => handleCopyQuery(schemaDescribe[0].full_name)}
                  >
                    <CopyIcon className="icon-header" />
                  </div>
                )}
                <div onClick={() => setSchemaDescribe([])}>
                  <CloseMenuIcon className="icon-header" />
                </div>
              </div>
            </div>
            <div className="chain-info-desc__content">
              {schemaDescribe.map((item, index) => (
                <Flex
                  key={index + 'schema'}
                  direction={'row'}
                  py="6px"
                  justifyContent={'space-between'}
                  px="16px"
                  cursor={'pointer'}
                  onClick={() => handleCopyQuery(item.column_name)}
                >
                  <Tooltip
                    placement={'top'}
                    hasArrow
                    label={item.column_name}
                    p={2}
                  >
                    <Box isTruncated maxW={'50%'}>
                      {item.column_name}
                    </Box>
                  </Tooltip>
                  <div className="data-type">
                    <Text isTruncated>{item.data_type}</Text>
                    <CopyIcon />
                  </div>
                </Flex>
              ))}
            </div>
          </Box>
        )}
      </div>
    );
  };

  return (
    <div className={'workspace-page__sidebar'}>
      <div
        className={
          expandSidebar
            ? 'workspace-page__sidebar__categories'
            : 'workspace-page__sidebar__categories hidden-sidebar-content'
        }
      >
        {categoryList.map((item) => (
          <Box
            cursor={'pointer'}
            key={item.id}
            title={item.title}
            onClick={() => {
              setCategory(item.id);
              onToggleExpandSidebar(true);
              setSchemaDescribe([]);
            }}
          >
            {category === item.id ? item.activeIcon : item.icon}
          </Box>
        ))}
      </div>
      <Box
        className={
          expandSidebar
            ? 'workspace-page__sidebar__content show-sidebar '
            : 'workspace-page__sidebar__content hidden-sidebar'
        }
      >
        {category === CATEGORIES.EXPLORE_DATA
          ? _renderContentExplore()
          : _renderContentWorkPlace()}
      </Box>
    </div>
  );
};

export default Sidebar;
