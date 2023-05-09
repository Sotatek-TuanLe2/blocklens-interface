import { Flex } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { CloseMenuIcon, TagIcon } from 'src/assets/icons';
import { AppButton, AppInput } from 'src/components';
import ModalNewDashboard from 'src/modals/querySQL/ModalNewDashboard';
import { LIST_ITEM_TYPE } from '..';

interface IFilterSearch {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
}

const FilterSearch: React.FC<IFilterSearch> = (props) => {
  const { type } = props;
  const history = useHistory();
  const { search: searchUrl } = useLocation();

  const [search, setSearch] = useState<string>('');

  const [tag, setTag] = useState<string>('');
  const [openNewDashboardModal, setOpenNewDashboardModal] =
    useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(searchUrl);

    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tags') || '';

    setSearch(search || '');
    setTag(tag || '');
  }, [type, searchUrl]);

  const PLACE_HOLDERS = {
    [LIST_ITEM_TYPE.DASHBOARDS]: 'DEX...',
    [LIST_ITEM_TYPE.QUERIES]: 'DEX...',
  };

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete('search');
    searchParams.set('search', e.target.value);
    history.push(`/dashboards?${searchParams.toString()}`);
  };

  const getRemoveTagUrl = () => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete('tags');
    return `/dashboards?${searchParams.toString()}`;
  };

  const onClickNew = () => {
    switch (type) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        onToggleNewDashboardModal();
        break;
      case LIST_ITEM_TYPE.QUERIES:
        history.push('/queries');
        break;
      default:
        break;
    }
  };

  const onToggleNewDashboardModal = () =>
    setOpenNewDashboardModal((prevState) => !prevState);

  return (
    <div className="dashboard-filter__search">
      <div className="dashboard-filter__search__title">
        Search for {type.toLocaleLowerCase()}
      </div>
      <AppInput
        className="dashboard-filter__search__input"
        placeholder={PLACE_HOLDERS[type]}
        value={search}
        onChange={onChangeSearch}
      />

      {tag && (
        <Flex
          className="dashboard-filter__search__tag"
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <div className="tag-title">
            <TagIcon />
            <span className="truncate">{tag}</span>
          </div>
          <Link to={getRemoveTagUrl()}>
            <CloseMenuIcon width={12} />
          </Link>
        </Flex>
      )}

      <>
        <AppButton
          className="dashboard-filter__search__button"
          onClick={onClickNew}
        >
          New {type === LIST_ITEM_TYPE.DASHBOARDS ? 'dashboard' : 'query'}
        </AppButton>
      </>

      <ModalNewDashboard
        open={openNewDashboardModal}
        onClose={onToggleNewDashboardModal}
      />
    </div>
  );
};

export default FilterSearch;
