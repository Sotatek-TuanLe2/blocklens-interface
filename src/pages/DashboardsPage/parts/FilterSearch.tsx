import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { LIST_ITEM_TYPE } from '..';

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

const FilterSearch: React.FC<IFilterSearch> = (props) => {
  const { type } = props;
  const history = useHistory();
  const [rankBy, setRankBy] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('');

  useEffect(() => {
    switch (type) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        setRankBy(RANKS.TRENDING);
        break;
      case LIST_ITEM_TYPE.QUERIES:
        setRankBy(RANKS.FAVORITES);
        break;
      default:
        break;
    }
  }, [type]);

  useEffect(() => {
    // TODO: add params into URL
  }, [rankBy]);

  const isDashboardOrQuery =
    type === LIST_ITEM_TYPE.DASHBOARDS || type === LIST_ITEM_TYPE.QUERIES;

  const ranks =
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? [RANKS.FAVORITES, RANKS.TRENDING, RANKS.NEW]
      : [RANKS.FAVORITES, RANKS.NEW];

  const onClickRank = (rank: string) => () => setRankBy(rank);

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
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            {ranks.map((rank) => (
              <div
                className="dashboard-filter__search__selects__item"
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
      {isDashboardOrQuery && (
        <div className="dashboard-filter__search__title">Time range</div>
      )}
    </div>
  );
};

export default FilterSearch;
