import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconCopy,
  IconHeart,
  IconHeartFavorite,
  IconOptions,
  IconShare,
  ListNetworkIcon,
} from 'src/assets/icons';
import { VisibilityGridDashboardList } from 'src/constants';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { LIST_ITEM_TYPE } from '..';
import { listTags } from './FilterSearch';
import { Dashboard } from 'src/utils/utils-dashboard';
import { Query } from 'src/utils/utils-query';
import moment from 'moment';
// import AppNetworkIcons from 'src/components/AppNetworkIcons';

interface IListItem {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  item?: IDashboardDetail | IQuery;
  typeVisiable: 'COLUMN' | 'ROW';
}

// const listNetworkCurrency = ['Goerli', 'BSC', 'POLYGON', 'BTC'];

const ListItem: React.FC<IListItem> = (props) => {
  const { type, item, typeVisiable } = props;

  const [favorite, setFavorite] = useState<boolean>(false);

  const itemClass =
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? new Dashboard(item as IDashboardDetail)
      : new Query(item as IQuery);

  const getTitleUrl = (): string => {
    switch (type) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        return `/dashboards/${itemClass.getId()}/`;
      case LIST_ITEM_TYPE.QUERIES:
        return `/queries/${itemClass.getId()}`;
      default:
        return '/dashboards';
    }
  };

  const _renderDropdown = () => {
    return (
      <Menu>
        <MenuButton>
          <Button size="sm" className="item-options">
            <IconOptions />
          </Button>
        </MenuButton>
        <MenuList className="menu-option">
          <MenuItem className="menu-info">
            <IconCopy /> Copy
          </MenuItem>
          <MenuItem className="menu-info">
            <IconShare /> Share
          </MenuItem>
        </MenuList>
      </Menu>
    );
  };

  const _renderDashboardListColumn = () => {
    return (
      <div className="dashboard-list__item--column">
        <Flex flexDirection="column" alignItems={'center'}>
          <div className="dashboard-list__item--column__avatar">
            <Link to={getTitleUrl()}>
              <img
                src="/images/ThumnailDashboard.png"
                alt=""
                className="thumbnail"
              />
            </Link>
            <div className="dashboard-list__item--column__box-favourite">
              {favorite ? (
                <IconHeartFavorite onClick={() => setFavorite((pre) => !pre)} />
              ) : (
                <IconHeart onClick={() => setFavorite((pre) => !pre)} />
              )}
              25
            </div>
          </div>
          <div className="dashboard-list__item--column__content">
            <Flex
              className="dashboard-list__item--column__content__title"
              alignItems={'center'}
            >
              <Flex flexDirection={'column'}>
                <Link className="item-name" to={getTitleUrl()}>
                  {itemClass.getName()}
                </Link>
                <Flex flexDirection={'row'}>
                  {listTags.map((item) => (
                    <div key={item.id} className="tag-name">
                      #{item.name}
                    </div>
                  ))}
                </Flex>
              </Flex>

              {_renderDropdown()}
            </Flex>
            <Flex
              mt={'14px'}
              flexDirection={'row'}
              justifyContent="space-between"
            >
              <Flex flexDirection={'row'}>
                <img src="/images/AvatarDashboardCard.png" alt="avatar" />
                <div className="dashboard-list__item--column__content__item-desc">
                  <Text>Tyler Covington</Text>
                  <Text>{moment(item?.createdAt).format('YYYY MMMM Do')}</Text>
                </div>
              </Flex>
              <ListNetworkIcon />
            </Flex>
          </div>
        </Flex>
      </div>
    );
  };

  const _renderDashboardListRow = () => {
    return (
      <div className="dashboard-list__item--row">
        <Flex flexDirection="row" alignItems={'center'}>
          <Link
            to={getTitleUrl()}
            className="dashboard-list__item--row__avatar"
          >
            <img
              src="/images/ThumnailDashboard.png"
              alt=""
              className="thumbnail"
            />

            <div className="item-name">{itemClass.getName()}</div>
          </Link>
          <div className="item-desc">
            <img src="/images/AvatarDashboardCard.png" alt="avatar" />
            <p>Tyler Covington</p>
          </div>
          <div className="item-chain">
            <ListNetworkIcon />
          </div>
          <div className="item-date">
            {moment(item?.createdAt).format('YYYY MMMM Do')}
          </div>
          <div className="item-tag">
            {listTags.map((item) => (
              <div key={item.id} className="tag-name">
                #{item.name}
              </div>
            ))}
          </div>
          <div className="item-favorite">
            {favorite ? (
              <IconHeartFavorite onClick={() => setFavorite((pre) => !pre)} />
            ) : (
              <IconHeart onClick={() => setFavorite((pre) => !pre)} />
            )}
            25
          </div>
          <div className="item-btn-options">{_renderDropdown()}</div>
        </Flex>
      </div>
    );
  };

  return (
    <>
      {typeVisiable === VisibilityGridDashboardList.COLUMN
        ? _renderDashboardListColumn()
        : _renderDashboardListRow()}
    </>
  );
};

const Tag: React.FC<{ value: string }> = ({ value }) => {
  return (
    <Link className="item-tag" to={'/'} target={'_blank'}>
      #{value}
    </Link>
  );
};

export default ListItem;
