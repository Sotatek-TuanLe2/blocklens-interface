import { Box, Collapse, Flex, Text, useDisclosure } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
  IconFilter,
  IconDisplayGrid,
  IconDisplayList,
  DashboardListIcon,
  QueriesIcon,
  IconEye,
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
import Storage from 'src/utils/utils-storage';

interface IFilterSearch {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  displayed: string;
  setDisplayed: (display: string) => void;
  itemType: string;
}

const optionType: IOption[] = [
  { value: 'created_at:asc', label: 'Date low to high' },
  { value: 'created_at:desc', label: 'Date high to low' },
];

const MAX_TRENDING_TAGS = 3;

const FilterSearch: React.FC<IFilterSearch> = (props) => {
  const SUGGEST_TAGS_LIMIT = 10;
  const { isOpen, onToggle } = useDisclosure();
  const { type, displayed, setDisplayed, itemType } = props;
  const history = useHistory();
  const { user } = useUser();
  const ref = useRef<any>(null);

  const isDashboard = type === LIST_ITEM_TYPE.DASHBOARDS;
  const hasTypeSelection =
    type === LIST_ITEM_TYPE.MYWORK || type === LIST_ITEM_TYPE.SAVED;
  const { search: searchUrl } = useLocation();

  const [search, setSearch] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [inputSearch, setInputSearch] = useState<string>('');
  const [tagSearch, setTagSearch] = useState<string>('');
  const [suggestTags, setSuggestTags] = useState<string[]>([]);
  const [isOpenSuggestTags, setIsOpenSuggestTags] = useState<boolean>(false);
  const [openNewDashboardModal, setOpenNewDashboardModal] =
    useState<boolean>(false);
  const [listTagsTrending, setListTagsTrending] = useState<string[]>([]);

  const searchParams = new URLSearchParams(searchUrl);

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
      searchParams.get(HOME_URL_PARAMS.ORDERBY) || 'created_at:asc';
    const tag = searchParams.get(HOME_URL_PARAMS.TAG) || '';
    setSearch(search);
    setOrderBy(orderBy);
    setTag(tag);
    setInputSearch(search);
  }, [searchUrl]);

  useEffect(() => {
    setDisplayed(isDashboard ? DisplayType.Grid : DisplayType.List);
  }, [type]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current?.contains(event.target)) {
        isOpenSuggestTags && setIsOpenSuggestTags(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, isOpenSuggestTags]);

  const fetchTrendingTags = async () => {
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
    fetchTrendingTags();
  }, [type, itemType]);

  const fetchSearchTags = async () => {
    if (!tagSearch) {
      return;
    }
    const res = isDashboard
      ? await rf
          .getRequest('DashboardsRequest')
          .getDashboardTags({ search: tagSearch, limit: SUGGEST_TAGS_LIMIT })
      : await rf
          .getRequest('DashboardsRequest')
          .getQueryTags({ search: tagSearch, limit: SUGGEST_TAGS_LIMIT });
    if (res && res.data) {
      setSuggestTags(res.data.reverse());
      setIsOpenSuggestTags(true);
    }
  };

  useEffect(() => {
    fetchSearchTags();
  }, [tagSearch]);

  const onClickNew = () => {
    return onToggleNewDashboardModal();
  };

  const onToggleNewDashboardModal = () =>
    setOpenNewDashboardModal((prevState) => !prevState);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.startsWith('#')) {
      setTagSearch(inputValue.slice(1, inputValue.length));
      setInputSearch(inputValue);
      setIsOpenSuggestTags(true);
    } else {
      setTagSearch('');
      setInputSearch(inputValue);
      setIsOpenSuggestTags(false);
      searchParams.delete(HOME_URL_PARAMS.SEARCH);
      inputValue && searchParams.set(HOME_URL_PARAMS.SEARCH, inputValue);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onClickSearch = () => {
    if (!search) {
      setIsOpenSuggestTags(true);
    }
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

  const onSelectedTag = (value: string) => {
    const historyTags = Storage.getSavedTagHistory(isDashboard);
    Storage.setSavedTagHistory(
      isDashboard,
      Array.from(new Set([...historyTags, value])),
    );
    searchParams.delete(HOME_URL_PARAMS.TAG);
    searchParams.set(HOME_URL_PARAMS.TAG, `${value}`);
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const onClearTag = () => {
    searchParams.delete(HOME_URL_PARAMS.TAG);
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const _generatePlaceHolder = () => {
    switch (type) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        return 'Search #hastag or dashboard name';
      case LIST_ITEM_TYPE.QUERIES:
        return 'Search #hastag or query name';
      default:
        return 'Search #hastag, dashboard or query';
    }
  };

  const _renderSuggestTags = () => {
    const suggestTagList = tagSearch
      ? suggestTags
      : Storage.getSavedTagHistory(isDashboard).slice(0, SUGGEST_TAGS_LIMIT);

    if (!suggestTagList.length) {
      return (
        <Box className="dashboard-filter__search__search-box" ref={ref}>
          <Text className="no-result">No matching result</Text>
        </Box>
      );
    }

    const onClickTag =
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => (tag: string) => {
        e.preventDefault();
        onSelectedTag(tag);
        setTagSearch('');
        setInputSearch('');
        setIsOpenSuggestTags(false);
      };

    return (
      <Box className="dashboard-filter__search__search-box" ref={ref}>
        {suggestTagList.map((tag: string) => (
          <Flex
            alignItems="center"
            gap="5px"
            key={tag}
            onClick={(e) => onClickTag(e)(tag)}
            className="dashboard-filter__search__search-box--item"
          >
            {search === '' && tag === '' && <IconEye />} <Text>#{tag}</Text>
          </Flex>
        ))}
      </Box>
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
            <Box flexGrow={1} mb={{ base: 5, lg: 0 }} position="relative">
              <AppInput
                className="dashboard-filter__search__input"
                placeholder={_generatePlaceHolder()}
                value={inputSearch}
                variant="searchFilter"
                isSearch
                onChange={onChangeSearch}
                onClick={onClickSearch}
              />
              {isOpenSuggestTags && _renderSuggestTags()}
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
                {!!tag && (
                  <AppButton
                    variant="action"
                    className="dashboard-filter__search__clear-tag"
                    onClick={onClearTag}
                  >
                    Clear tag
                  </AppButton>
                )}
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
