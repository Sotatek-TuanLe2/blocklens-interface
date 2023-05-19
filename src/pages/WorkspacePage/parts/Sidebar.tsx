import { Box, Collapse, Fade, Flex, Text } from '@chakra-ui/react';
import _, { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import {
  CloseBtnV2Icon,
  ExploreActiveV2Icon,
  ExploreV2Icon,
  FolderActiveV2Icon,
  FolderV2Icon,
  LogoDashboardV2Icon,
  LogoQueryV2Icon,
  PlusV2Icon,
} from 'src/assets/icons';
import { AppInput } from 'src/components';
import ModalNewDashboard from 'src/modals/querySQL/ModalNewDashboard';
import rf from 'src/requests/RequestFactory';
import { PROMISE_STATUS, ROUTES, SchemaType } from 'src/utils/common';
import { CHAIN_NAME, IDashboardDetail, IQuery } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { getLogoChainByChainId } from 'src/utils/utils-network';
import { toastError } from 'src/utils/utils-notify';

interface IValue {
  queries: IQuery[];
  dashboards: IDashboardDetail[];
}

const getChainIcon = (chainName: string) => {
  let iconClassName: string;
  switch (chainName) {
    case CHAIN_NAME.ETH_GOERLI:
    case CHAIN_NAME.ETH_MAINNET: {
      iconClassName = getLogoChainByChainId('ETH') || '';
      break;
    }
    case CHAIN_NAME.BSC_TESTNET:
    case CHAIN_NAME.BSC_MAINNET: {
      iconClassName = getLogoChainByChainId('BSC') || '';
      break;
    }
    case CHAIN_NAME.APTOS_MAINNET:
    case CHAIN_NAME.APTOS_TESTNET:
      iconClassName = 'icon-aptos';
      break;
    default:
      iconClassName = getLogoChainByChainId('POLYGON') || '';
      break;
  }
  return <Box className={iconClassName}></Box>;
};

const ItemNetworkChain = ({ chain }: { chain: any }) => {
  const [show, setShow] = useState(false);
  const [schemaDescribe, setSchemaDescribe] = useState<SchemaType[] | null>();

  const handleToggle = async () => {
    setShow((pre) => !pre);
    if (!show) {
      try {
        const data = await rf.getRequest('DashboardsRequest').getSchemaOfTable({
          namespace: chain.namespace,
          tableName: chain.table_name,
        });
        setSchemaDescribe(data);
        //get schema
      } catch (error) {
        console.log('error', error);
      }
    }
  };
  return (
    <>
      <Box display={'flex'} onClick={handleToggle} className="chain-info-title">
        <div>{getChainIcon(chain.namespace)}</div>
        <span>{chain.table_name}</span>
      </Box>

      <Collapse in={show} className="chain-info-desc">
        {/* <Box>{chain.namespace}</Box> */}
        {!!schemaDescribe &&
          schemaDescribe.map((item) => (
            <Flex
              direction={'row'}
              py="6px"
              pl={'10px'}
              justifyContent={'space-between'}
            >
              <Box isTruncated maxW={'50%'}>
                {item.column_name}
              </Box>
              <Text isTruncated>{item.data_type}</Text>
            </Flex>
          ))}
      </Collapse>
    </>
  );
};

const CollapseExplore = ({
  title,
  content,
}: {
  title: string;
  content: any;
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
        <span>{title}</span>
      </Box>

      <Collapse
        animateOpacity
        in={show}
        className="workspace-page__sidebar__content__explore-wrap__content-collapse"
      >
        {content.map((chain: any, index: number) => {
          return (
            <ItemNetworkChain chain={chain} key={index + 'chain'} />
            // <Box display={'flex'}>
            //   <div>{getChainIcon(chain.namespace)}</div>
            //   <span>{chain.namespace}</span>
            // </Box>
          );
        })}
      </Collapse>
    </>
  );
};

const Sidebar: React.FC = () => {
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
      id: CATEGORIES.WORK_PLACE,
      title: 'Work place',
      icon: <FolderV2Icon></FolderV2Icon>,
      activeIcon: <FolderActiveV2Icon></FolderActiveV2Icon>,
    },
    {
      id: CATEGORIES.EXPLORE_DATA,
      title: 'Explore data',
      icon: <ExploreV2Icon></ExploreV2Icon>,
      activeIcon: <ExploreActiveV2Icon></ExploreActiveV2Icon>,
    },
  ];

  const [category, setCategory] = useState<string>(CATEGORIES.WORK_PLACE);
  const [searchValue, setSearchValue] = useState<string>('');
  const params: { queryId?: string; dashboardId?: string } = useParams();
  const [value, setValue] = useState<IValue | null>();
  const [dataExplore, setDataExplore] = useState<{
    [key: string]: any;
  } | null>();
  const [toggleSideBarContent, setToogleSideBarContent] = useState(true);
  const history = useHistory();
  const [openNewDashboardModal, setOpenNewDashboardModal] = useState(false);

  const fetchDashboards: any = async (params: any) => {
    try {
      const res: any = await rf
        .getRequest('DashboardsRequest')
        .getListBrowseDashboard(params);
      return { ...res, docs: res.data };
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };
  const fetchQueries: any = async (params: any) => {
    try {
      const res: any = await rf
        .getRequest('DashboardsRequest')
        .getListBrowseQueries(params);
      return { ...res, docs: res.data };
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const fetchData = async (search: any) => {
    const data: any = await Promise.allSettled([
      fetchDashboards(_.omitBy({ search }, (param) => !param)),
      fetchQueries(_.omitBy({ search }, (param) => !param)),
    ]);
    setValue(() => {
      let temp: any;
      if (data[0].status === PROMISE_STATUS.FULFILLED) {
        temp = { ...temp, dashboards: data[0].value.docs };
      }
      if (data[1].status === PROMISE_STATUS.FULFILLED) {
        temp = { ...temp, queries: data[1].value.docs };
      }
      return temp;
    });
  };

  useEffect(() => {
    fetchData(null);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const tables = await rf
          .getRequest('DashboardsRequest')
          .getTables(params);

        const listChain = _.groupBy(
          tables,
          (item) => item.namespace.split('_')[0],
        );

        setDataExplore(listChain);
      } catch (error) {
        toastError(getErrorMessage(error));
      }
    })();
  }, []);
  const getDataSearchWorkPlace = useCallback(
    debounce(async (search) => {
      fetchData(search);
    }, 500),
    [],
  );

  const handleCreateNewQuery = () => {
    history.push('/queries');
  };

  const handleCreateNewDashboard = () => {
    setOpenNewDashboardModal(true);
    console.log('new dashboard');
  };

  const handleClassNameWorkPlaceItem = (id: any) => {
    if (id === params?.queryId || id === params?.dashboardId) {
      return 'workspace-page__sidebar__content__work-place-wrap__work-place-detail work-place-detail-active ';
    }
    return 'workspace-page__sidebar__content__work-place-wrap__work-place-detail ';
  };

  const _renderContentWorkPlace = () => {
    return (
      <Box className="workspace-page__sidebar__content__work-place-wrap">
        <div className="workspace-page__sidebar__content__work-place-wrap__work-place">
          <span>work place</span>
          <Box
            cursor={'pointer'}
            onClick={() => setToogleSideBarContent((pre) => !pre)}
          >
            <CloseBtnV2Icon />
          </Box>
        </div>
        <AppInput
          value={searchValue}
          marginY={4}
          placeholder={'Search...'}
          size="md"
          onChange={(e) => {
            setSearchValue(e.target.value);
            getDataSearchWorkPlace(e.target.value);
          }}
        />

        <div className="workspace-page__sidebar__content__work-place-wrap__work-place-content">
          <span>Query</span>{' '}
          <div onClick={handleCreateNewQuery}>
            <PlusV2Icon cursor={'pointer'} />
          </div>
        </div>
        {!!value?.queries ? (
          value?.queries.length ? (
            <>
              {value.queries.map((query) => (
                <div
                  className={handleClassNameWorkPlaceItem(query.id)}
                  onClick={() => history.push(`${ROUTES.QUERY}/${query.id}?`)}
                >
                  <div>
                    <LogoQueryV2Icon />
                  </div>
                  <Text isTruncated>{query.name}</Text>
                </div>
              ))}
            </>
          ) : (
            <div>No data...</div>
          )
        ) : (
          <div>Some thing was wrong</div>
        )}
        <Box
          mt="20px"
          className="workspace-page__sidebar__content__work-place-wrap__work-place-content"
        >
          <span>Dashboard</span>{' '}
          <div onClick={handleCreateNewDashboard}>
            <PlusV2Icon cursor={'pointer'} />
          </div>
        </Box>
        {!!value?.dashboards ? (
          value?.dashboards.length ? (
            <>
              {value.dashboards.map((dashboard) => (
                <div
                  className={handleClassNameWorkPlaceItem(dashboard.id)}
                  onClick={() =>
                    history.push(`${ROUTES.DASHBOARD}/${dashboard.id}?`)
                  }
                >
                  <div>
                    <LogoDashboardV2Icon />
                  </div>
                  <Text isTruncated>{dashboard.name}</Text>
                </div>
              ))}
            </>
          ) : (
            <div>No data...</div>
          )
        ) : (
          <div>Some thing was wrong</div>
        )}
      </Box>
    );
  };
  console.log('dataExplore', dataExplore);
  const _renderContentExplore = () => {
    return (
      <div className="workspace-page__sidebar__content__explore-wrap">
        <div className="workspace-page__sidebar__content__explore-wrap__title">
          <span>Explore data</span>
          <Box
            cursor={'pointer'}
            onClick={() => setToogleSideBarContent((pre) => !pre)}
          >
            <CloseBtnV2Icon />
          </Box>
        </div>
        {!!dataExplore && (
          <>
            {Object.keys(dataExplore).map((nameChain: any, index) => (
              <CollapseExplore
                title={nameChain}
                content={Object.values(dataExplore)[index]}
              />
              // <Box>
              //   <Box className="workspace-page__sidebar__content__explore-wrap__content">
              //     <span>{nameChain}</span>
              //   </Box>
              //   {Object.values(dataExplore)[index].map((chain: any) => {
              //     return (
              //       <Box display={'flex'}>
              //         <div>{getChainIcon(chain.namespace)}</div>
              //         <span>{chain.namespace}</span>
              //       </Box>
              //     );
              //   })}
              // </Box>
            ))}
          </>
        )}
      </div>
    );
  };

  const _renderContent = () => {
    switch (category) {
      case CATEGORIES.WORK_PLACE:
        return _renderContentWorkPlace();
      case CATEGORIES.EXPLORE_DATA:
        // return <ExploreData />; // the old EditorSidebar
        return _renderContentExplore();
    }
  };

  return (
    <div className="workspace-page__sidebar">
      <div className="workspace-page__sidebar__categories">
        {categoryList.map((item) => (
          <Box
            cursor={'pointer'}
            key={item.id}
            title={item.title}
            onClick={() => {
              setCategory(item.id);
              setToogleSideBarContent(true);
            }}
          >
            {category === item.id ? item.activeIcon : item.icon}
          </Box>
        ))}
      </div>
      <Box
        display={toggleSideBarContent ? 'block' : 'none'}
        className="workspace-page__sidebar__content"
      >
        {_renderContent()}
      </Box>
      <ModalNewDashboard
        open={openNewDashboardModal}
        onClose={async () => {
          setOpenNewDashboardModal(false);
          const dataDashboard: any = await fetchDashboards();
          setValue((pre: any) => ({ ...pre, dashboards: dataDashboard.docs }));
        }}
      />
    </div>
  );
};

export default Sidebar;
