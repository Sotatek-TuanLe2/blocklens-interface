import { Box, Button, Flex, Text } from '@chakra-ui/react';
import _ from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
  FireIcon,
  FireIconInactive,
  IconColumnDashboard,
  IconListDashboard,
} from 'src/assets/icons';
import { AppButton, AppInput, AppSelect2, IOption } from 'src/components';
import { VisibilityGridDashboardList } from 'src/constants';
import ModalNewDashboard from 'src/modals/querySQL/ModalNewDashboard';
import rf from 'src/requests/RequestFactory';
import { ROUTES } from 'src/utils/common';
import {
  getChainIconByChainName,
  getChainIconInactiveByChainName,
} from 'src/utils/utils-network';
import { LIST_ITEM_TYPE } from '..';

interface IFilterSearch {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  typeVisiable: 'COLUMN' | 'ROW';
  setVisibility: any;
}

interface ILISTNETWORK {
  value: string;
  label: string;
  chain: string;
}

const optionType: IOption[] = [
  { value: 'datelowtohigh', label: 'Date low to high' },
  { value: 'datehightolow', label: 'Date high to low' },
  { value: 'likedlowtohigh', label: 'Liked low to high' },
  { value: 'likedhightolow', label: 'Liked high to low' },
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

const FilterSearch: React.FC<IFilterSearch> = (props) => {
  const URL_PARAMS = {
    SEARCH: 'search',
    SORT: 'sort',
    CHAIN: 'chain',
    TAG: 'tag',
  };

  const { type, typeVisiable, setVisibility } = props;
  const history = useHistory();
  const { search: searchUrl } = useLocation();

  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [openNewDashboardModal, setOpenNewDashboardModal] =
    useState<boolean>(false);

  const [chainsSupported, setChainsSupported] = useState<ILISTNETWORK[]>([]);

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

    const search = searchParams.get(URL_PARAMS.SEARCH) || '';
    const sort = searchParams.get(URL_PARAMS.SORT) || '';
    const chain = searchParams.get(URL_PARAMS.CHAIN) || '';
    const tag = searchParams.get(URL_PARAMS.TAG) || '';

    setSearch(search);
    setSort(sort);
    setChain(chain);
    setTag(tag);
    type === LIST_ITEM_TYPE.QUERIES
      ? setVisibility(VisibilityGridDashboardList.ROW)
      : setVisibility(VisibilityGridDashboardList.COLUMN);
  }, [type, searchUrl]);

  const onClickNew = () => {
    switch (type) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        onToggleNewDashboardModal();
        break;
      case LIST_ITEM_TYPE.QUERIES:
        history.push(ROUTES.QUERY);
        break;
      default:
        break;
    }
  };

  const onToggleNewDashboardModal = () =>
    setOpenNewDashboardModal((prevState) => !prevState);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete(URL_PARAMS.SEARCH);
    if (e.target.value) {
      searchParams.set(URL_PARAMS.SEARCH, e.target.value);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onChangeSort = (value: string) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete(URL_PARAMS.SORT);
    searchParams.set(URL_PARAMS.SORT, value);
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onChangeChain = (value: string) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete(URL_PARAMS.CHAIN);
    if (value) {
      searchParams.set(URL_PARAMS.CHAIN, value);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onChangeTag = (value: string) => {
    const searchParams = new URLSearchParams(searchUrl);
    const currentTag = searchParams.get(URL_PARAMS.TAG);
    searchParams.delete(URL_PARAMS.TAG);
    if (currentTag !== value) {
      searchParams.set(URL_PARAMS.TAG, value);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  return (
    <div>
      <Flex flexDirection={'row'} justifyContent={'space-between'}>
        <Flex>
          <Flex mr={3}>
            <AppButton
              onClick={() => onChangeChain('')}
              variant="network"
              className={chain === '' ? 'btn-active' : 'btn-inactive'}
            >
              {chain === '' ? <FireIcon /> : <FireIconInactive />}
              <Text ml={2}>All</Text>
            </AppButton>
          </Flex>
          <Flex flexDirection={'row'}>
            {chainsSupported.map((network, index) => {
              return (
                <Flex mr={3}>
                  <AppButton
                    onClick={() => onChangeChain(network.value)}
                    key={index}
                    variant="network"
                    className={
                      chain === network.value ? 'btn-active' : 'btn-inactive'
                    }
                  >
                    <Box
                      className={
                        chain === network.value
                          ? getChainIconByChainName(network.value)
                          : getChainIconInactiveByChainName(network.value)
                      }
                    ></Box>
                    <Text ml={2}>{network.label}</Text>
                  </AppButton>
                </Flex>
              );
            })}
          </Flex>
        </Flex>

        <AppButton onClick={onClickNew}>
          <Box className="icon-plus-circle" mr={2} /> Create
        </AppButton>
      </Flex>
      <Flex mt={5} flexDirection="row">
        <AppInput
          className="dashboard-filter__search__input"
          placeholder={'Search...'}
          value={search}
          onChange={onChangeSearch}
        />
        <AppSelect2
          size="medium"
          value={sort}
          onChange={onChangeSort}
          options={optionType}
          className="dashboard-filter__search__select"
        />
        {type === LIST_ITEM_TYPE.DASHBOARDS && (
          <>
            <Button
              onClick={() => setVisibility(VisibilityGridDashboardList.ROW)}
              className={`dashboard-filter__search__button ${
                typeVisiable === VisibilityGridDashboardList.ROW
                  ? 'dashboard-filter__search__button--active'
                  : ''
              }`}
            >
              <IconListDashboard />
            </Button>
            <Button
              onClick={() => setVisibility(VisibilityGridDashboardList.COLUMN)}
              className={`dashboard-filter__search__button ${
                typeVisiable === VisibilityGridDashboardList.COLUMN
                  ? 'dashboard-filter__search__button--active'
                  : ''
              }`}
            >
              <IconColumnDashboard />
            </Button>
          </>
        )}
      </Flex>
      <Flex mt={'14px'} flexDirection={'row'}>
        {listTags.map((item) => (
          <div
            key={item.id}
            onClick={() => onChangeTag(item.name)}
            className={`dashboard-filter__item-tag ${
              item.name === tag ? 'dashboard-filter__item-tag--active' : ''
            }`}
          >
            #{item.name}
          </div>
        ))}
      </Flex>
      <ModalNewDashboard
        open={openNewDashboardModal}
        onClose={onToggleNewDashboardModal}
      />
    </div>
  );
};

export default FilterSearch;
