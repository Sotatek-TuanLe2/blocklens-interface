import { Box, Collapse, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
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
import { DisplayType } from 'src/constants';
import useUser from 'src/hooks/useUser';
import ModalCreateNew from 'src/modals/querySQL/ModalCreateNew';
import rf from 'src/requests/RequestFactory';
import { ROUTES } from 'src/utils/common';
import { HOME_URL_PARAMS, LIST_ITEM_TYPE, ITEM_TYPE } from '..';
import { AddIcon } from '@chakra-ui/icons';
import { IDataMenu } from '../../../utils/utils-app';

interface IFilterSearch {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  displayed: string;
  setDisplayed: (display: string) => void;
  itemType: string;
}

const optionType: IOption[] = [
  { value: 'created_at:desc', label: 'Date low to high' },
  { value: 'created_at:asc', label: 'Date high to low' },
];

const MAX_TRENDING_TAGS = 3;

const FilterSearch: React.FC<IFilterSearch> = (props) => {
  const { isOpen, onToggle } = useDisclosure();
  const { type, displayed, setDisplayed, itemType } = props;
  const history = useHistory();
  const { user } = useUser();

  const isDashboard = type === LIST_ITEM_TYPE.DASHBOARDS;
  const hasTypeSelection =
    type === LIST_ITEM_TYPE.MYWORK || type === LIST_ITEM_TYPE.SAVED;
  const { search: searchUrl } = useLocation();

  const [search, setSearch] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [tag, setTag] = useState<string>('');

  const searchParams = new URLSearchParams(searchUrl);

  const [openNewDashboardModal, setOpenNewDashboardModal] =
    useState<boolean>(false);
  const [listTagsTrending, setListTagsTrending] = useState<string[]>([]);

  const menuDashboardQueries: IDataMenu[] = [
    {
      value: ITEM_TYPE.DASHBOARDS,
      icon: <DashboardListIcon />,
      label: 'Dashboard',
    },
    {
      value: ITEM_TYPE.QUERIES,
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
    const search = searchParams.get(HOME_URL_PARAMS.SEARCH) || '';
    const orderBy =
      searchParams.get(HOME_URL_PARAMS.ORDERBY) || 'created_at:desc';
    const tag = searchParams.get(HOME_URL_PARAMS.TAG) || '';

    setSearch(search);
    setOrderBy(orderBy);
    setTag(tag);
  }, [searchUrl]);

  useEffect(() => {
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
    searchParams.delete(HOME_URL_PARAMS.SEARCH);
    if (e.target.value) {
      searchParams.set(HOME_URL_PARAMS.SEARCH, e.target.value);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onChangeOrderBy = (value: string) => {
    searchParams.delete(HOME_URL_PARAMS.ORDERBY);
    searchParams.set(HOME_URL_PARAMS.ORDERBY, value);
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onChangeTag = (value: string) => {
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

  const onChangeItemType = (value: string) => {
    searchParams.delete(HOME_URL_PARAMS.ITEM_TYPE);
    if (value !== ITEM_TYPE.DASHBOARDS) {
      searchParams.set(HOME_URL_PARAMS.ITEM_TYPE, value);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const fetchTagsTrending = async () => {
    try {
      if (
        isDashboard ||
        (hasTypeSelection && itemType === LIST_ITEM_TYPE.DASHBOARDS)
      ) {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getPublicDashboardTagsTrending();

        setListTagsTrending(res?.tags || []);
      } else {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getPublicQueryTagsTrending();

        setListTagsTrending(res?.tags || []);
      }
    } catch (error) {
      setListTagsTrending([]);
    }
  };

  useEffect(() => {
    fetchTagsTrending();
  }, [itemType, type]);

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
          {hasTypeSelection && (
            <Flex flexGrow={{ base: 1, lg: 0 }} maxW={'50%'}>
              <AppMenu
                data={menuDashboardQueries}
                value={itemType}
                setValue={onChangeItemType}
                minW={{ base: 'auto', lg: '179px' }}
              />
            </Flex>
          )}
          <Flex
            flexGrow={{ base: 1, lg: 0 }}
            transition={'.2s linear'}
            ml={!isDashboard && !hasTypeSelection ? 0 : 2.5}
            onClick={onToggle}
            userSelect={'none'}
            className="filter"
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
              className="btn-create"
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
              className="btn-create"
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
                {listTagsTrending
                  .slice(0, MAX_TRENDING_TAGS)
                  .map((item: string, index: number) => (
                    <AppTag
                      key={index}
                      value={item}
                      variant="md"
                      onClick={() => onChangeTag(item)}
                      selected={item === tag}
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
                value={orderBy}
                onChange={onChangeOrderBy}
                options={optionType}
                className="dashboard-filter__search__select"
                sxWrapper={{
                  w: { base: '100% !important', lg: '200px !important' },
                  h: '44px',
                }}
              />
            </Box>
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
