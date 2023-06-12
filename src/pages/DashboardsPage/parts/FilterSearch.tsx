import {
  Box,
  Button,
  Collapse,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import _ from 'lodash';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
  FilterIcon,
  FireIcon,
  FireIconInactive,
  IconColumnDashboard,
  IconDashboard,
  IconDashboardInactive,
  IconListDashboard,
  IconQueries,
  IconQueriesInactive,
} from 'src/assets/icons';
import {
  AppButton,
  AppInput,
  AppSelect2,
  AppTag,
  IOption,
} from 'src/components';
import { DisplayType, VisibilityGridDashboardList } from 'src/constants';
import useUser from 'src/hooks/useUser';
import ModalCreateNew from 'src/modals/querySQL/ModalCreateNew';
import rf from 'src/requests/RequestFactory';
import { ROUTES } from 'src/utils/common';
import {
  getChainIconByChainName,
  getChainIconInactiveByChainName,
} from 'src/utils/utils-network';
import { HOME_URL_PARAMS, LIST_ITEM_TYPE } from '..';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface IFilterSearch {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  displayed: DisplayType;
  setDisplayed: (display: DisplayType) => void;
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

const MenuShowDisplay: FC<{
  displayType: DisplayType;
  setDisplayType: (dis: DisplayType) => void;
}> = ({ displayType, setDisplayType }) => {
  const _renderDisplayGrid = () => {
    return (
      <Flex align={'center'}>
        <IconColumnDashboard />
        <Text px={2}>Grid</Text>
      </Flex>
    );
  };

  const _renderDisplayList = () => {
    return (
      <Flex align={'center'}>
        <IconListDashboard />
        <Text px={2}>List</Text>
      </Flex>
    );
  };

  return (
    <Menu>
      <MenuButton
        w={'full'}
        display={'flex'}
        alignItems={'center'}
        justify={'center'}
        h={10}
        minW={'124px'}
        bg={'white'}
        border={'1px solid #C7D2E1'}
        borderRadius={'6px'}
        as={Button}
        rightIcon={<ChevronDownIcon />}
      >
        {displayType === DisplayType.Grid
          ? _renderDisplayGrid()
          : _renderDisplayList()}
      </MenuButton>

      <MenuList minW={'124px'} mt={-2} zIndex={4}>
        <MenuItem
          onClick={() => {
            setDisplayType(DisplayType.Grid);
          }}
          px={5}
          h={8}
          _hover={{ bg: '#0060DB', color: 'white' }}
          transition={'.2s linear'}
        >
          {_renderDisplayGrid()}
        </MenuItem>
        <MenuItem
          px={5}
          h={8}
          _hover={{ bg: '#0060DB', color: 'white' }}
          transition={'.2s linear'}
          onClick={() => {
            setDisplayType(DisplayType.List);
          }}
        >
          {_renderDisplayList()}
        </MenuItem>
      </MenuList>
    </Menu>
  );
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
              <MenuShowDisplay
                displayType={displayed}
                setDisplayType={setDisplayed}
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
            _hover={{ bg: 'gray.200' }}
            cursor={'pointer'}
            userSelect={'none'}
          >
            <FilterIcon />
            <Text px={2}>Filter</Text>
          </Flex>
        </Flex>
        <Box display={{ base: 'none', lg: 'block' }}>
          <AppButton className="btn-primary" onClick={onClickNew} h={10}>
            <Box className="icon-plus-circle" mr={2} /> Create
          </AppButton>
        </Box>
      </Flex>
      <Collapse
        in={isOpen}
        animateOpacity
        style={{ overflow: 'visible !important' }}
      >
        <Box
          borderTop={'1px solid rgba(0, 2, 36, 0.1)'}
          mt={{ base: '22px', lg: '28px' }}
          pt={{ base: '22px', lg: '20px' }}
        >
          <Flex flexDir={{ base: 'column', lg: 'row' }}>
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

  return (
    <div>
      <Flex flexDirection={'row'} justifyContent={'space-between'}>
        {isMyWork ? (
          <Flex>
            <Flex flexDirection={'row'}>
              <Flex mr={3}>
                <AppButton
                  onClick={() => onChangeMyWorkType(TYPE_MYWORK.DASHBOARDS)}
                  variant="network"
                  className={
                    myWorkType === TYPE_MYWORK.DASHBOARDS
                      ? 'btn-active'
                      : 'btn-inactive'
                  }
                >
                  {myWorkType === TYPE_MYWORK.DASHBOARDS ? (
                    <IconDashboard />
                  ) : (
                    <IconDashboardInactive />
                  )}
                  <Text ml={2}>Dashboard</Text>
                </AppButton>
              </Flex>
            </Flex>
            <Flex mr={3}>
              <AppButton
                onClick={() => onChangeMyWorkType(TYPE_MYWORK.QUERIES)}
                variant="network"
                className={
                  myWorkType === TYPE_MYWORK.QUERIES
                    ? 'btn-active'
                    : 'btn-inactive'
                }
              >
                {myWorkType === TYPE_MYWORK.QUERIES ? (
                  <IconQueries />
                ) : (
                  <IconQueriesInactive />
                )}
                <Text ml={2}>Queries</Text>
              </AppButton>
            </Flex>
          </Flex>
        ) : (
          _renderNetWork()
        )}
        {!!user && (
          <AppButton className="btn-primary" onClick={onClickNew}>
            <Box className="icon-plus-circle" mr={2} /> Create
          </AppButton>
        )}
      </Flex>
      <Flex mt={5} flexDirection="row">
        <AppInput
          className="dashboard-filter__search__input"
          placeholder={'Search...'}
          value={search}
          variant="searchFilter"
          isSearch
          onChange={onChangeSearch}
        />
        <AppSelect2
          size="medium"
          value={sort || 'datelowtohigh'}
          onChange={onChangeSort}
          options={optionType}
          className="dashboard-filter__search__select"
        />
        {isDashboard && (
          <>
            <Button
              onClick={() => changeVisibility(VisibilityGridDashboardList.ROW)}
              className={`dashboard-filter__search__button ${
                visibility === VisibilityGridDashboardList.ROW
                  ? 'dashboard-filter__search__button--active'
                  : ''
              }`}
            >
              <IconListDashboard />
            </Button>
            <Button
              onClick={() =>
                changeVisibility(VisibilityGridDashboardList.COLUMN)
              }
              className={`dashboard-filter__search__button ${
                visibility === VisibilityGridDashboardList.COLUMN
                  ? 'dashboard-filter__search__button--active'
                  : ''
              }`}
            >
              <IconColumnDashboard />
            </Button>
          </>
        )}
      </Flex>
      <Flex
        mt={'14px'}
        flexDirection={'row'}
        className="dashboard-filter__tag-list tag "
      >
        {listTags.map((item) => (
          <AppTag
            key={item.id}
            value={item.name}
            variant="md"
            onClick={() => onChangeTag(item.name)}
            selected={item.name === tag}
          />
        ))}
      </Flex>
      <ModalCreateNew
        open={openNewDashboardModal}
        onClose={onToggleNewDashboardModal}
      />
    </div>
  );
};

export default FilterSearch;
