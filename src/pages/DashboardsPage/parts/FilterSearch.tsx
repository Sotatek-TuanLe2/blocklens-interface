import {
  Box,
  Button,
  Collapse,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import _ from 'lodash';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
  FireIcon,
  IconFilter,
  IconDisplayGrid,
  IconDisplayList,
  DashboardListIcon,
  QueriesIcon,
} from 'src/assets/icons';
import {
  AppButton,
  AppInput,
  AppMenu,
  AppSelect2,
  AppTag,
  IOption,
} from 'src/components';
import { DisplayType, VisibilityGridDashboardList } from 'src/constants';
import useUser from 'src/hooks/useUser';
import ModalCreateNew from 'src/modals/querySQL/ModalCreateNew';
import rf from 'src/requests/RequestFactory';
import { ROUTES } from 'src/utils/common';
import { getChainIconByChainName } from 'src/utils/utils-network';
import { HOME_URL_PARAMS, LIST_ITEM_TYPE } from '..';
import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import { IDataMenu } from '../../../utils/utils-app';

interface IFilterSearch {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  displayed: string;
  setDisplayed: (display: string) => void;
  visibility: 'COLUMN' | 'ROW';
  changeVisibility: (value: VisibilityGridDashboardList) => void;
  myWorkType: string;
  changeMyWorkType: (value: string) => void;
}

interface ILISTNETWORK {
  value: string;
  label: string;
  chain: string;
}

const optionType: IOption[] = [
  { value: 'datelowtohigh', label: 'Date low to high' },
  { value: 'datehightolow', label: 'Date high to low' },
  // { value: 'likedlowtohigh', label: 'Liked low to high' },
  // { value: 'likedhightolow', label: 'Liked high to low' },
];

export const listTags = [
  {
    name: 'defi',
    id: 1,
  },
  {
    name: 'gas',
    id: 2,
  },
  {
    name: 'dex',
    id: 3,
  },
];

export const TYPE_MYWORK = {
  DASHBOARDS: 'DASHBOARDS',
  QUERIES: 'QUERIES',
};

const FilterSearch: React.FC<IFilterSearch> = (props) => {
  const { isOpen, onToggle } = useDisclosure();
  const {
    type,
    visibility,
    changeVisibility,
    displayed,
    setDisplayed,
    myWorkType,
    changeMyWorkType,
  } = props;
  const history = useHistory();
  const { user } = useUser();
  // console.log('user: ', user);

  const isDashboard = type === LIST_ITEM_TYPE.DASHBOARDS;
  const isMyWork = type === LIST_ITEM_TYPE.MYWORK;
  const { search: searchUrl } = useLocation();

  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [openNewDashboardModal, setOpenNewDashboardModal] =
    useState<boolean>(false);

  const [chainsSupported, setChainsSupported] = useState<ILISTNETWORK[]>([]);

  const allChainSupprted: ILISTNETWORK = {
    value: '',
    label: 'All',
    chain: 'All',
  };

  const menuDashboardQueries: IDataMenu[] = [
    {
      value: LIST_ITEM_TYPE.DASHBOARDS,
      icon: <DashboardListIcon />,
      label: 'Dashboard',
    },
    {
      value: LIST_ITEM_TYPE.QUERIES,
      icon: <QueriesIcon />,
      label: 'Queries',
    },
  ];

  const menuGridList: IDataMenu[] = [
    {
      value: DisplayType.Grid,
      icon: <IconDisplayGrid />,
      label: 'Grid',
    },
    {
      value: DisplayType.List,
      icon: <IconDisplayList />,
      label: 'List',
    },
  ];

  useEffect(() => {
    (async () => {
      const listChainRes = await rf
        .getRequest('DashboardsRequest')
        .getSupportedChains();

      const listChain = listChainRes.map((chain: string) => {
        const chainName = chain.split('_')[0];
        return {
          value: chain,
          label: chainName.toUpperCase(),
          chain: chainName,
        };
      });

      const result = _.uniqBy<ILISTNETWORK>(listChain, 'chain');
      setChainsSupported(result);
    })();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(searchUrl);

    const search = searchParams.get(HOME_URL_PARAMS.SEARCH) || '';
    const sort = searchParams.get(HOME_URL_PARAMS.SORT) || '';
    const chain = searchParams.get(HOME_URL_PARAMS.CHAIN) || '';
    const tag = searchParams.get(HOME_URL_PARAMS.TAG) || '';

    setSearch(search);
    setSort(sort);
    setChain(chain);
    setTag(tag);
  }, [searchUrl]);

  useEffect(() => {
    isDashboard
      ? changeVisibility(VisibilityGridDashboardList.COLUMN)
      : changeVisibility(VisibilityGridDashboardList.ROW);

    isDashboard
      ? setDisplayed(DisplayType.Grid)
      : setDisplayed(DisplayType.List);
  }, [type]);

  const onClickNew = () => {
    return onToggleNewDashboardModal();
  };

  const onToggleNewDashboardModal = () =>
    setOpenNewDashboardModal((prevState) => !prevState);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete(HOME_URL_PARAMS.SEARCH);
    if (e.target.value) {
      searchParams.set(HOME_URL_PARAMS.SEARCH, e.target.value);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onChangeSort = (value: string) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete(HOME_URL_PARAMS.SORT);
    searchParams.set(HOME_URL_PARAMS.SORT, value);
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onChangeChain = (value: string) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete(HOME_URL_PARAMS.CHAIN);
    if (value) {
      searchParams.set(HOME_URL_PARAMS.CHAIN, value);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onChangeTag = (value: string) => {
    const searchParams = new URLSearchParams(searchUrl);
    const currentTag = searchParams.get(HOME_URL_PARAMS.TAG);
    searchParams.delete(HOME_URL_PARAMS.TAG);
    if (currentTag !== value) {
      searchParams.set(HOME_URL_PARAMS.TAG, value);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onChangeMyWorkType = (value: string) => {
    changeMyWorkType(value);
    history.push(ROUTES.HOME);
  };

  const _renderNetWork = () => {
    return (
      <AppSelect2
        size="medium"
        value={chain || ''}
        onChange={onChangeChain}
        options={[allChainSupprted, ...chainsSupported] as IOption[]}
        className="dashboard-filter__search__select"
        sxWrapper={{
          w: { base: '100% !important', lg: '200px !important' },
          h: '44px',
        }}
        customItem={(chainSp: IOption) => {
          return (
            <Flex align={'center'}>
              {chainSp.value === '' ? (
                <Box w={5}>
                  <FireIcon />
                </Box>
              ) : (
                <Box className={getChainIconByChainName(chainSp.value)} />
              )}
              <Text ml={2}>{chainSp.label}</Text>
            </Flex>
          );
        }}
      />
    );
  };

  return (
    <>
      <Flex align={'center'}>
        <Flex align={'center'} flexGrow={1}>
          {isDashboard && (
            <Flex flexGrow={{ base: 1, lg: 0 }}>
              <AppMenu
                data={menuGridList}
                value={displayed}
                setValue={setDisplayed}
                minW={'124px'}
              />
            </Flex>
          )}
          {isMyWork && (
            <Flex flexGrow={{ base: 1, lg: 0 }}>
              <AppMenu
                data={menuDashboardQueries}
                value={myWorkType}
                setValue={onChangeMyWorkType}
                minW={'179px'}
              />
            </Flex>
          )}
          <Flex
            flexGrow={{ base: 1, lg: 0 }}
            align={'center'}
            px={5}
            h={10}
            minW={'124px'}
            bg={'white'}
            border={'1px solid #C7D2E1'}
            borderRadius={'6px'}
            transition={'.2s linear'}
            ml={2.5}
            onClick={onToggle}
            cursor={'pointer'}
            userSelect={'none'}
          >
            <IconFilter color={'rgba(0, 2, 36, 0.5)'} />
            <Text className={'text-filter'} px={2}>
              Filter
            </Text>
          </Flex>
        </Flex>
        {!!user && (
          <Box>
            <AppButton
              display={{ base: 'none', lg: 'flex' }}
              minW={'120px'}
              className="btn-primary"
              onClick={onClickNew}
              h={10}
            >
              <Box className="icon-plus-circle" mr={2} /> Create
            </AppButton>
            <AppButton
              display={{ base: 'flex', lg: 'none' }}
              w={12}
              h={12}
              borderRadius={'24px'}
              className="btn-primary"
              onClick={onClickNew}
              pos={'fixed'}
              top={'68%'}
              right={4}
              zIndex={10}
            >
              <AddIcon fontWeight={700} fontSize={'25px'} />
            </AppButton>
          </Box>
        )}
      </Flex>
      <Collapse
        in={isOpen}
        animateOpacity
        style={{ overflow: 'visible !important' }}
      >
        <Box pt={{ base: '22px', lg: '28px' }}>
          <Flex
            flexDir={{ base: 'column', lg: 'row' }}
            borderTop={'1px solid rgba(0, 2, 36, 0.1)'}
            pt={{ base: '22px', lg: '20px' }}
          >
            <Box flexGrow={1} mb={{ base: 5, lg: 0 }}>
              <AppInput
                className="dashboard-filter__search__input"
                placeholder={'Search...'}
                value={search}
                variant="searchFilter"
                isSearch
                onChange={onChangeSearch}
              />
              <Flex mt={'14px'}>
                {listTags.map((item) => (
                  <AppTag
                    key={item.id}
                    value={item.name}
                    variant="md"
                    onClick={() => onChangeTag(item.name)}
                    selected={item.name === tag}
                    h={'32px'}
                    color={'rgba(0, 2, 36, 0.5)'}
                    bg={'rgba(0, 2, 36, 0.05)'}
                    borderRadius={'6px'}
                  />
                ))}
              </Flex>
            </Box>

            <Box
              ml={{ lg: 2.5 }}
              mb={{ base: '13px', lg: 0 }}
              pos={'relative'}
              zIndex={10}
            >
              <AppSelect2
                size="medium"
                value={sort || 'datelowtohigh'}
                onChange={onChangeSort}
                options={optionType}
                className="dashboard-filter__search__select"
                sxWrapper={{
                  w: { base: '100% !important', lg: '200px !important' },
                  h: '44px',
                }}
              />
            </Box>
            <Box ml={{ lg: 2.5 }}>{_renderNetWork()}</Box>
          </Flex>
        </Box>
      </Collapse>
      <ModalCreateNew
        open={openNewDashboardModal}
        onClose={onToggleNewDashboardModal}
      />
    </>
  );
};

export default FilterSearch;
