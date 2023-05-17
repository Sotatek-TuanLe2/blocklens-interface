import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
  FireIcon,
  IconBNBActive,
  IconBNBInactive,
  IconBTCActive,
  IconBTCInactive,
  IconColumnDashboard,
  IconETHActive,
  IconETHInactive,
  IconListDashboard,
} from 'src/assets/icons';
import { AppButton, AppInput, AppSelect2, IOption } from 'src/components';
import { VisibilityGridDashboardList } from 'src/constants';
import { ROUTES } from 'src/utils/common';
import { LIST_ITEM_TYPE } from '..';
import ModalNewDashboard from 'src/modals/querySQL/ModalNewDashboard';

interface IFilterSearch {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  typeVisiable: 'COLUMN' | 'ROW';
  setVisibility: any;
}

interface ILISTNETWORK {
  name: string;
  value: string;
  iconActive?: ReactNode;
  iconInactive?: ReactNode;
}

const LIST_NETWORK: ILISTNETWORK[] = [
  {
    name: 'All',
    value: 'All',
    iconActive: <FireIcon />,
    iconInactive: <FireIcon />,
  },
  {
    name: 'BTC',
    value: 'BTC',
    iconActive: <IconBTCActive />,
    iconInactive: <IconBTCInactive />,
  },
  {
    name: 'ETH',
    value: 'ETH',
    iconActive: <IconETHActive />,
    iconInactive: <IconETHInactive />,
  },
  {
    name: 'BNB',
    value: 'BNB',
    iconActive: <IconBNBActive />,
    iconInactive: <IconBNBInactive />,
  },
];

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
  const { type, typeVisiable, setVisibility } = props;
  const history = useHistory();
  const { search: searchUrl } = useLocation();

  const [search, setSearch] = useState<string>('');

  const [sort, setSort] = useState<string>('');
  const [chain, setChain] = useState<string>('All');
  const [openNewDashboardModal, setOpenNewDashboardModal] =
    useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(searchUrl);

    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';
    const chain = searchParams.get('chain') || '';

    setSearch(search || '');
    setSort(sort || 'datehightolow');
    setChain(chain || 'All');
    type === LIST_ITEM_TYPE.QUERIES
      ? setVisibility(VisibilityGridDashboardList.ROW)
      : setVisibility(VisibilityGridDashboardList.COLUMN);
  }, [type, searchUrl]);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete('search');
    searchParams.set('search', e.target.value);
    history.push(`${ROUTES.HOME}?${searchParams.toString()}`);
  };

  const getRemoveTagUrl = () => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete('tags');
    return `${ROUTES.HOME}?${searchParams.toString()}`;
  };

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

  const onChange = (value: string) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete('sort');
    searchParams.set('sort', value);
    history.push(`/dashboards?${searchParams.toString()}`);
  };

  const onSelectChain = (value: string) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete('chain');
    searchParams.set('chain', value);
    history.push(`/dashboards?${searchParams.toString()}`);
  };

  return (
    <div>
      <Flex flexDirection={'row'} justifyContent={'space-between'}>
        <Flex flexDirection={'row'}>
          {LIST_NETWORK.map((network, index) => {
            return (
              <Flex mr={3}>
                <AppButton
                  onClick={() => onSelectChain(network.value)}
                  key={index}
                  variant="network"
                  className={
                    chain === network.value ? 'btn-active' : 'btn-inactive'
                  }
                >
                  {chain === network.value
                    ? network.iconActive
                    : network.iconInactive}
                  <Text ml={2}>{network.name}</Text>
                </AppButton>
              </Flex>
            );
          })}
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
          onChange={onChange}
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
          <div key={item.id} className="dashboard-filter__item-tag">
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
