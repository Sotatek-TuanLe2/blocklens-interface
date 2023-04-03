import { Flex } from '@chakra-ui/react';
import { ChangeEvent, useEffect } from 'react';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { AppButton, AppInput } from 'src/components';
import { IDashboardParams, IQueriesParams, LIST_ITEM_TYPE } from '..';

interface IFilterSearch {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
}

const RANKS = {
  FAVORITES: 'favorites',
  TRENDING: 'trending',
  NEW: 'created_at',
};

const RANK_TITLES = {
  [RANKS.FAVORITES]: 'Favorites',
  [RANKS.TRENDING]: 'Trending',
  [RANKS.NEW]: 'New',
};

const FAVORITES_TIME_RANGE: {
  title: string;
  value: string;
}[] = [
  { title: '24 hours', value: '24h' },
  { title: '7 days', value: '7d' },
  { title: '30 days', value: '30d' },
  { title: 'All time', value: 'all' },
];

const TRENDING_TIME_RANGE: {
  title: string;
  value: string;
}[] = [
  { title: '1 hour', value: '1h' },
  { title: '4 hours', value: '4h' },
  { title: '24 hours', value: '24h' },
];

const FilterSearch: React.FC<IFilterSearch> = (props) => {
  const { type } = props;
  const history = useHistory();
  const { search: searchUrl } = useLocation();
  const [rankBy, setRankBy] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('');

  useEffect(() => {
    const searchParams = new URLSearchParams(searchUrl);
    const order = searchParams.get('order') || '';
    const time_range = searchParams.get('time_range') || '';
    const q = searchParams.get('q') || '';

    switch (type) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        setRankBy(order || RANKS.TRENDING);
        setSearch(q || '');
        setTimeRange(time_range || TRENDING_TIME_RANGE[1].value);
        break;
      case LIST_ITEM_TYPE.QUERIES:
        setRankBy(order || RANKS.FAVORITES);
        setSearch(q || '');
        setTimeRange(time_range || FAVORITES_TIME_RANGE[1].value);
        break;
      default:
        break;
    }
  }, [type, searchUrl]);

  const isDashboardOrQuery =
    type === LIST_ITEM_TYPE.DASHBOARDS || type === LIST_ITEM_TYPE.QUERIES;

  const PLACE_HOLDERS = {
    [LIST_ITEM_TYPE.DASHBOARDS]: 'DEX...',
    [LIST_ITEM_TYPE.QUERIES]: 'DEX...',
    [LIST_ITEM_TYPE.WIZARDS]: 'Name...',
    [LIST_ITEM_TYPE.TEAMS]: 'Dune...',
  };

  const ranks =
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? [RANKS.FAVORITES, RANKS.TRENDING, RANKS.NEW]
      : [RANKS.FAVORITES, RANKS.NEW];

  const onClickRank = (rank: string) => () => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete('order');
    searchParams.set('order', rank);
    switch (rank) {
      case RANKS.FAVORITES:
        searchParams.set('time_range', FAVORITES_TIME_RANGE[1].value);
        break;
      case RANKS.TRENDING:
        searchParams.set('time_range', TRENDING_TIME_RANGE[1].value);
        break;
      default:
        searchParams.delete('time_range');
        break;
    }
    history.push(`/dashboards?${searchParams.toString()}`);
  };

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete('q');
    searchParams.set('q', e.target.value);
    history.push(`/dashboards?${searchParams.toString()}`);
  };

  const onClickTimeRange = (timeRange: string) => () => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete('time_range');
    searchParams.set('time_range', timeRange);
    history.push(`/dashboards?${searchParams.toString()}`);
  };

  return (
    <div className="dashboard-filter__search">
      {isDashboardOrQuery && (
        <>
          <div className="dashboard-filter__search__title">
            Rank {type === LIST_ITEM_TYPE.DASHBOARDS ? 'dashboards' : 'queries'}{' '}
            by
          </div>
          <Flex
            className="dashboard-filter__search__selects"
            alignItems={'center'}
          >
            {ranks.map((rank) => (
              <div
                key={rank}
                className={`dashboard-filter__search__selects__item ${
                  rank === rankBy
                    ? 'dashboard-filter__search__selects__item--selected'
                    : ''
                }`}
                onClick={onClickRank(rank)}
              >
                {RANK_TITLES[rank]}
              </div>
            ))}
          </Flex>
        </>
      )}
      <div className="dashboard-filter__search__title">
        Search for {type.toLocaleLowerCase()}
      </div>
      <AppInput
        className="dashboard-filter__search__input"
        placeholder={PLACE_HOLDERS[type]}
        value={search}
        onChange={onChangeSearch}
      />
      {isDashboardOrQuery && rankBy !== RANKS.NEW && (
        <>
          <div className="dashboard-filter__search__title">Time range</div>
          <Flex
            className="dashboard-filter__search__selects"
            alignItems={'center'}
          >
            {(rankBy === RANKS.FAVORITES
              ? FAVORITES_TIME_RANGE
              : TRENDING_TIME_RANGE
            ).map((item) => (
              <div
                key={item.value}
                className={`dashboard-filter__search__selects__item ${
                  item.value === timeRange
                    ? 'dashboard-filter__search__selects__item--selected'
                    : ''
                }`}
                onClick={onClickTimeRange(item.value)}
              >
                {item.title}
              </div>
            ))}
          </Flex>
        </>
      )}
      {type !== LIST_ITEM_TYPE.WIZARDS && (
        <>
          <hr />
          <AppButton className="dashboard-filter__search__button">
            New{' '}
            {type === LIST_ITEM_TYPE.DASHBOARDS
              ? 'dashboard'
              : type === LIST_ITEM_TYPE.QUERIES
              ? 'query'
              : 'team'}
          </AppButton>
        </>
      )}
    </div>
  );
};

export default FilterSearch;
