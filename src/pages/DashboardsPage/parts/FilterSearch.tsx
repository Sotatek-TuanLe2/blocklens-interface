import { Box, Collapse, Flex, Text, useDisclosure } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
  IconFilter,
  IconDisplayGrid,
  IconDisplayList,
  DashboardListIcon,
  QueriesIcon,
  HistoryTagsIcon,
} from 'src/assets/icons';
import {
  AppButton,
  AppInput,
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
const SUGGEST_TAGS_LIMIT = 10;
const TAGS_HISTORY_LIMIT = 8;

const FilterSearch: React.FC<IFilterSearch> = (props) => {
  const { isOpen, onToggle } = useDisclosure();
  const { type, displayed, setDisplayed, itemType } = props;
  const history = useHistory();
  const { user } = useUser();
  const ref = useRef<any>(null);

  const isDashboardTab = type === LIST_ITEM_TYPE.DASHBOARDS;
  const isDashboard = itemType === ITEM_TYPE.DASHBOARDS;
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

  const menuDashboardQueries: IOption[] = [
    {
      value: ITEM_TYPE.DASHBOARDS,
      label: 'Dashboard',
      icon: <DashboardListIcon />,
    },
    {
      value: ITEM_TYPE.QUERIES,
      label: 'Queries',
      icon: <QueriesIcon />,
    },
  ];

  const menuGridList: IOption[] = [
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
    setInputSearch(search);
  }, [searchUrl]);

  useEffect(() => {
    setDisplayed(isDashboardTab ? DisplayType.Grid : DisplayType.List);
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
      if (isDashboardTab || (hasTypeSelection && isDashboard)) {
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
      setSuggestTags(res.data);
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
    searchParams.delete(HOME_URL_PARAMS.SEARCH);
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
    searchParams.delete(HOME_URL_PARAMS.SEARCH);
    searchParams.delete(HOME_URL_PARAMS.ORDERBY);
    searchParams.delete(HOME_URL_PARAMS.TAG);
    if (value !== ITEM_TYPE.DASHBOARDS) {
      searchParams.set(HOME_URL_PARAMS.ITEM_TYPE, value);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  const _generatePlaceHolder = () => {
    if (isDashboard) {
      return 'Search #hastag or dashboard name';
    }
    return 'Search #hastag or query name';
  };

  const _renderSuggestTags = () => {
    const suggestTagList = !!tagSearch
      ? suggestTags
      : Storage.getSavedTagHistory(isDashboard).slice(0, TAGS_HISTORY_LIMIT);

    if (!!tagSearch && !suggestTagList.length) {
      return (
        <Box className="dashboard-filter__search__search-box" ref={ref}>
          <Text className="no-result">No matching result</Text>
        </Box>
      );
    }

    if (!suggestTagList.length) {
      return null;
    }

    const onClickTag =
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => (tag: string) => {
        e.preventDefault();
        setTagSearch('');
        setInputSearch('');
        setIsOpenSuggestTags(false);
        onChangeTag(tag);
        const historyTags = Storage.getSavedTagHistory(isDashboard);
        Storage.setSavedTagHistory(
          isDashboard,
          Array.from(new Set([tag, ...historyTags])),
        );
      };

    return (
      <Box className="dashboard-filter__search__search-box" ref={ref}>
        {suggestTagList.map((tag: string) => (
          <Flex
            alignItems="center"
            gap="9px"
            key={tag}
            onClick={(e) => onClickTag(e)(tag)}
            className="dashboard-filter__search__search-box--item"
          >
            {!tagSearch && <HistoryTagsIcon />} <Text>#{tag}</Text>
          </Flex>
        ))}
      </Box>
    );
  };

  const _renderSearchInput = () => {
    if (!!tag) {
      return (
        <Box className="dashboard-filter__search__input dashboard-filter__search__input--tag">
          <AppTag
            value={tag}
            variant="sm"
            closable
            onClose={() => onChangeTag(tag)}
          />
        </Box>
      );
    }

    return (
      <>
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
      </>
    );
  };

  return (
    <>
      <Flex align={'center'}>
        <Flex align={'center'} flexGrow={1}>
          {isDashboardTab && (
            <Flex flexGrow={{ base: 1, lg: 0 }}>
              <AppSelect2
                size="medium"
                options={menuGridList}
                value={displayed}
                onChange={setDisplayed}
                width="100%"
                fontWeight="500"
                sxWrapper={{
                  w: { base: '100% !important', lg: '129px !important' },
                  h: '44px',
                }}
              />
            </Flex>
          )}
          {hasTypeSelection && (
            <Flex flexGrow={{ base: 1, lg: 0 }} maxW={'50%'}>
              <AppSelect2
                size="medium"
                options={menuDashboardQueries}
                value={itemType}
                onChange={onChangeItemType}
                width="100%"
                fontWeight="500"
                sxWrapper={{
                  w: { base: '100% !important', lg: '179px !important' },
                  h: '44px',
                }}
              />
            </Flex>
          )}
          <Flex
            flexGrow={{ base: 1, lg: 0 }}
            transition={'.2s linear'}
            ml={!isDashboardTab && !hasTypeSelection ? 0 : 2.5}
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
              {_renderSearchInput()}
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
      {openNewDashboardModal && (
        <ModalCreateNew
          open={openNewDashboardModal}
          onClose={onToggleNewDashboardModal}
        />
      )}
    </>
  );
};

export default FilterSearch;
