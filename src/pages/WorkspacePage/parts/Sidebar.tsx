import {
  Box,
  BoxProps,
  Button,
  Collapse,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Slide,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import _, { debounce } from 'lodash';
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CloseMenuIcon } from 'src/assets/icons';
import { AppButton, AppInput } from 'src/components';
import AppQueryMenu, { QUERY_MENU_LIST } from 'src/components/AppQueryMenu';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import rf from 'src/requests/RequestFactory';
import { IPagination, ROUTES, SchemaType } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { getChainIconByChainName } from 'src/utils/utils-network';
import { BROADCAST_FETCH_DASHBOARD } from './Dashboard';
import { BROADCAST_ADD_TO_EDITOR, BROADCAST_FETCH_QUERY } from './Query';
import { ChevronRightIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import useOriginPath from 'src/hooks/useOriginPath';

export const BROADCAST_FETCH_WORKPLACE_DATA = 'FETCH_WORKPLACE_DATA';

const ChainItem = ({
  chain,
  onChangeSelectedTable,
  selectedTable,
  isSearchTableName,
}: {
  chain: SchemaType;
  onChangeSelectedTable: React.Dispatch<
    React.SetStateAction<SchemaType | null>
  >;
  selectedTable: SchemaType | null;
  isSearchTableName: boolean;
}) => {
  const { pathname } = useLocation();

  const handleToggle = () => {
    console.log('chain', chain);

    onChangeSelectedTable(chain);
  };

  const handleAddToEditor = (query: string) => {
    AppBroadcast.dispatch(BROADCAST_ADD_TO_EDITOR, query);
  };

  return (
    <>
      <Box display={'flex'} onClick={handleToggle} className="chain-info-title">
        <Flex flex={1} maxW={isSearchTableName ? '70%' : '80%'} gap="10px">
          <div
            className={
              !!selectedTable &&
              selectedTable.table_name === chain.table_name &&
              selectedTable.schema === chain.schema
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
            label="Copy table's name"
            aria-label="A tooltip"
            borderRadius="6px"
          >
            <div
              className="add-query-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToEditor(chain.full_name);
              }}
            >
              <AddIcon />
            </div>
          </Tooltip>
        )}
        {isSearchTableName && (
          <div className={getChainIconByChainName(chain.schema)}></div>
        )}
      </Box>
    </>
  );
};

const CollapseExplore = ({
  title,
  content,
  onChangeSelectedTable,
  selectedTable,
}: {
  title: string;
  content: SchemaType[];
  onChangeSelectedTable: React.Dispatch<
    React.SetStateAction<SchemaType | null>
  >;
  selectedTable: SchemaType | null;
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
          <div className={getChainIconByChainName(title)}></div>
          <span>{title.split('_')[0].toUpperCase()}</span>
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
              onChangeSelectedTable={onChangeSelectedTable}
              selectedTable={selectedTable}
              isSearchTableName={false}
            />
          );
        })}
      </Collapse>
    </>
  );
};

interface SidebarProps {
  expandSidebar?: boolean;
  onToggleExpandSidebar?: (toggle?: boolean) => void;
  onCloseFilter?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  expandSidebar,
  onToggleExpandSidebar,
  onCloseFilter,
}) => {
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
  const location = useLocation();
  const { goWithOriginPath, goToOriginPath, generateLinkObject } =
    useOriginPath();

  const [category, setCategory] = useState<string>(CATEGORIES.EXPLORE_DATA);
  const [searchValueWorkPlace, setSearchValueWorkPlace] = useState<string>('');
  const [searchExploreData, setSearchExploreData] = useState<string>('');
  const [dataQueries, setDataQueries] = useState<IQuery[] | []>([]);
  const [exploreData, setExploreData] = useState<{
    [key: string]: any;
  }>({});
  const [selectedTable, setSelectedTable] = useState<SchemaType | null>(null);
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

  const fetchDataExploreData = async () => {
    try {
      const listChain = await rf.getRequest('DashboardsRequest').getSchemas();
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

  const filteredData = useMemo(() => {
    const result: { [key: string]: any } = [];
    for (const key in exploreData) {
      if (Object.prototype.hasOwnProperty.call(exploreData, key)) {
        const element = exploreData[key];

        for (const iterator of element) {
          if (
            iterator.table_name
              .toLowerCase()
              .includes(searchExploreData.trim().toLowerCase())
          ) {
            result.push(iterator);
          }
        }
      }
    }

    return result;
  }, [exploreData, searchExploreData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchExploreData(event.target.value);
  };

  const handleCreateNewQuery = () => goWithOriginPath(ROUTES.MY_QUERY);

  const getWorkplaceItemClassName = (id: string) => {
    return id === queryId || id === dashboardId
      ? 'workspace-page__sidebar__content__work-place-detail work-place-active '
      : 'workspace-page__sidebar__content__work-place-detail ';
  };

  const handleAddToEditor = (query: string) => {
    AppBroadcast.dispatch(BROADCAST_ADD_TO_EDITOR, query);
  };

  const onForkSuccess = async (response: any, type: string) => {
    await fetchDataWorkPlace();
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? AppBroadcast.dispatch(BROADCAST_FETCH_DASHBOARD, response.id)
      : AppBroadcast.dispatch(BROADCAST_FETCH_QUERY, response.id);
  };

  const onDeleteSuccess = async (item: IQuery | IDashboardDetail) => {
    if (item.id === queryId) {
      goToOriginPath();
    } else {
      fetchDataWorkPlace();
    }
  };

  const isOpenTableDetails = !!selectedTable;

  const _renderNoData = () => (
    <Box pl={{ base: '16px', lg: '0' }} className="data-empty">
      {!!searchExploreData && category === CATEGORIES.EXPLORE_DATA
        ? 'No matched dataset'
        : 'No data...'}
    </Box>
  );

  const _renderContentWorkPlace = () => {
    return (
      <Box className="workspace-page__sidebar__content__work-place-wrap">
        <div className="workspace-page__sidebar__content__work-place-wrap__work-place">
          <Box
            mr={'10px'}
            display={{ lg: 'none' }}
            className="icon-place-light"
          />
          <span>work place</span>
          <Box
            display={{ base: 'none', lg: 'block' }}
            cursor={'pointer'}
            onClick={() => onToggleExpandSidebar && onToggleExpandSidebar()}
            className="bg-CloseBtnIcon"
          ></Box>
        </div>
        <Box px={'16px'}>
          <AppInput
            isSearch
            className="workspace-page__sidebar__content__work-place-wrap__input-search"
            value={searchValueWorkPlace}
            placeholder={'Search...'}
            size="sm"
            onChange={(e) => {
              setSearchValueWorkPlace(e.target.value);
              getDataSearchWorkPlace(e.target.value);
            }}
            onFocus={(e) => {
              e.target.select();
            }}
          />
        </Box>

        <div className="workspace-page__sidebar__content__work-place-wrap__work-place-content">
          <span>Query</span>{' '}
          <BoxResponsive
            propsOnlyDesktop={{ onClick: handleCreateNewQuery }}
            propsOnlyMobile={{
              onClick: () => {
                handleCreateNewQuery();
                onClose();
                onCloseFilter && onCloseFilter();
              },
            }}
          >
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
          </BoxResponsive>
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
                <BoxResponsive
                  key={query.id}
                  className={getWorkplaceItemClassName(query.id)}
                  displayDesktop="flex"
                  propsOnlyMobile={{
                    onClick: () => {
                      onClose();
                      onCloseFilter && onCloseFilter();
                    },
                  }}
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
                        <Link
                          to={generateLinkObject(
                            `${ROUTES.MY_QUERY}/${query.id}`,
                          )}
                        >
                          {query.name}
                        </Link>
                      </Text>
                    </Flex>
                  </Tooltip>
                  <AppQueryMenu
                    menu={[QUERY_MENU_LIST.DELETE]}
                    itemType={LIST_ITEM_TYPE.QUERIES}
                    item={query}
                    onForkSuccess={onForkSuccess}
                    onDeleteSuccess={onDeleteSuccess}
                  />
                </BoxResponsive>
              ))}
            </InfiniteScroll>
          </div>
        ) : (
          _renderNoData()
        )}
      </Box>
    );
  };

  const _renderDetailExplore = () => {
    return (
      <>
        <div className="chain-info-desc__header">
          <Flex align={'center'} maxW={'70%'}>
            <Box
              display={{ lg: 'none' }}
              mr={'10px'}
              className="bg-chain_default"
            />
            <Tooltip
              placement={'top'}
              hasArrow
              label={selectedTable?.table_name}
              p={2}
            >
              <Text isTruncated maxW={'full'} className="info-detail-header">
                {selectedTable?.table_name}
              </Text>
            </Tooltip>
          </Flex>
          <div className="header-icon">
            {location.pathname.includes(ROUTES.MY_QUERY) && (
              <AddIcon
                className="icon-header"
                onClick={() => {
                  if (selectedTable?.full_name) {
                    handleAddToEditor(selectedTable?.full_name);
                  }
                }}
              />
            )}
            <Box
              display={{ base: 'none', lg: 'block' }}
              onClick={() => setSelectedTable(null)}
            >
              <CloseMenuIcon className="icon-header" />
            </Box>
          </div>
        </div>
        <div className="chain-info-desc__content">
          {selectedTable?.table_details.map((item, index) => (
            <Flex
              key={index + 'schema'}
              direction={'row'}
              py="6px"
              justifyContent={'space-between'}
              px={{ base: '20px', lg: '16px' }}
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
                <AddIcon
                  cursor={'pointer'}
                  onClick={() => handleAddToEditor(item.column_name)}
                />
              </div>
            </Flex>
          ))}
        </div>
      </>
    );
  };

  const _renderTableExplore = () => {
    return (
      <>
        {!!Object.keys(exploreData).length ? (
          <div
            className={`${
              isOpenTableDetails
                ? 'workspace-page__sidebar__content__explore-wrap__list-chain-half'
                : 'workspace-page__sidebar__content__explore-wrap__list-chain'
            }`}
          >
            {Object.keys(exploreData).map((nameChain: string, index) => (
              <CollapseExplore
                key={index + 'explore'}
                title={nameChain}
                content={Object.values(exploreData)[index]}
                onChangeSelectedTable={setSelectedTable}
                selectedTable={selectedTable}
              />
            ))}
          </div>
        ) : (
          _renderNoData()
        )}
      </>
    );
  };

  const _renderTableNameExplore = () => {
    return (
      <>
        {filteredData.length ? (
          <div className="workspace-page__sidebar__content__explore-wrap__table-search">
            <div className="title">Tables</div>
            {filteredData.map((chain: SchemaType, index: number) => {
              return (
                <ChainItem
                  chain={chain}
                  key={index + 'chain'}
                  onChangeSelectedTable={setSelectedTable}
                  selectedTable={selectedTable}
                  isSearchTableName={true}
                />
              );
            })}
          </div>
        ) : (
          _renderNoData()
        )}
      </>
    );
  };

  const _renderContentExplore = () => {
    return (
      <div className="workspace-page__sidebar__content__explore-wrap">
        <div className="workspace-page__sidebar__content__explore-wrap__title">
          <Box
            mr={'10px'}
            display={{ lg: 'none' }}
            className="icon-explore-light"
          />
          <span>Explore data</span>
          <Box
            display={{ base: 'none', lg: 'block' }}
            cursor={'pointer'}
            onClick={() => onToggleExpandSidebar && onToggleExpandSidebar()}
            className="bg-CloseBtnIcon"
          />
        </div>
        <Box px={'16px'} mb={{ base: '24px', lg: '26px' }}>
          <AppInput
            isSearch
            className="workspace-page__sidebar__content__work-place-wrap__input-search"
            value={searchExploreData}
            placeholder={'Search datasets...'}
            size="sm"
            onChange={handleSearch}
            onFocus={(e) => {
              e.target.select();
            }}
          />
        </Box>

        {!!searchExploreData
          ? _renderTableNameExplore()
          : _renderTableExplore()}

        {isOpenTableDetails && (
          <Box
            display={{ base: 'none !important', lg: 'block !important' }}
            className="chain-info-desc"
          >
            {_renderDetailExplore()}
          </Box>
        )}
        {/*  */}
        <Box display={{ lg: 'none !important' }} className="m-chain-info-desc">
          <SideContentExplore
            isOpen={isOpenTableDetails}
            onClose={() => setSelectedTable(null)}
          >
            {isOpenTableDetails && _renderDetailExplore()}
          </SideContentExplore>
        </Box>
        {/*  */}
      </div>
    );
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const _renderDrawerCategory = () => {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <Box className={'m-drawer-filter'} display={{ lg: 'none' }}>
            <Flex className={'drawer-header'}>
              <AppButton
                onClick={onClose}
                size="sm"
                variant="no-effects"
                className="icon-back-light"
              />
              <Flex align={'center'} justify={'center'} mx={'30px'}>
                <Text className={'text-header'}>
                  {categoryList.find((f) => f.id === category)?.title}
                </Text>
              </Flex>
            </Flex>
            {category === CATEGORIES.EXPLORE_DATA
              ? _renderContentExplore()
              : _renderContentWorkPlace()}
          </Box>
        </DrawerContent>
      </Drawer>
    );
  };

  const _renderOnMobile = () => {
    return (
      <Box className={'m-drawer-filter'} display={{ lg: 'none' }}>
        <Flex className={'drawer-header'}>
          <Flex align={'center'} justify={'center'} mx={'30px'}>
            <Text className={'text-header'}>Fillter</Text>
          </Flex>
          <Button
            variant="ghost"
            className={'btn-close-drawer'}
            onClick={onCloseFilter && onCloseFilter}
          >
            <CloseIcon w={'12px'} />
          </Button>
        </Flex>
        <Box>
          {categoryList.map((item) => (
            <Flex
              key={item.id}
              title={item.title}
              align={'center'}
              h={'32px'}
              mb={'20px'}
              onClick={() => {
                setCategory(item.id);
                setSelectedTable(null);
                onOpen();
              }}
            >
              <Flex align={'center'} flexGrow={1}>
                {item.icon}{' '}
                <Text ml={'10px'} className={'item-filter'}>
                  {item.title}
                </Text>
              </Flex>
              <ChevronRightIcon fontSize={'24px'} color={'#00022480'} />
            </Flex>
          ))}
        </Box>
        {_renderDrawerCategory()}
      </Box>
    );
  };

  const _renderOnDesktop = () => {
    return (
      <Flex
        display={{ base: 'none !important', lg: 'flex !important' }}
        className={'workspace-page__sidebar'}
      >
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
                onToggleExpandSidebar && onToggleExpandSidebar(true);
                setSelectedTable(null);
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
      </Flex>
    );
  };

  return (
    <>
      <>{_renderOnDesktop()}</>
      <>{_renderOnMobile()}</>
    </>
  );
};

interface AppResponsiveProps extends BoxProps {
  displayDesktop?: 'block' | 'flex' | 'grid';
  propsOnlyMobile?: BoxProps;
  propsOnlyDesktop?: BoxProps;
}

const BoxResponsive: FC<AppResponsiveProps> = ({
  displayDesktop = 'block',
  propsOnlyMobile,
  propsOnlyDesktop,
  ...otherProps
}) => {
  const restMobile = propsOnlyMobile
    ? { ...otherProps, ...propsOnlyMobile }
    : otherProps;

  const restDesktop = propsOnlyDesktop
    ? { ...otherProps, ...propsOnlyDesktop }
    : otherProps;
  return (
    <>
      <Box
        display={{
          base: 'none !important',
          lg: `${displayDesktop} !important`,
        }}
        {...restDesktop}
      />
      <Box display={{ lg: 'none !important' }} {...restMobile} />
    </>
  );
};

interface SideContentExploreProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const SideContentExplore: FC<SideContentExploreProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const [openSide, setOpenSide] = useState<boolean>(isOpen);

  useEffect(() => {
    setOpenSide(isOpen);
  }, [isOpen]);

  return (
    <Slide direction="bottom" in={openSide} className="side-content-explore">
      <div className="overlay-side" onClick={onClose} />
      <Flex direction={'column'} className="content-side">
        <Box pt={'8px'} pb={'11px'} px={4} onClick={onClose} mx={'auto'}>
          <div className="close-bar" />
        </Box>
        <Box
          flexGrow={1}
          overflow={'auto'}
          maxH={'calc(100% - 80px)'}
          h={'full'}
        >
          <div className="body-side">{children}</div>
        </Box>
        <Flex align={'center'} gap={'10px'} py={4}></Flex>
      </Flex>
    </Slide>
  );
};

export default Sidebar;
