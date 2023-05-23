import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { IconFork, IconOptions, IconShare } from 'src/assets/icons';
import AppNetworkIcons from 'src/components/AppNetworkIcons';
import { VisibilityGridDashboardList } from 'src/constants';
import { ROUTES } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { Dashboard } from 'src/utils/utils-dashboard';
import { Query } from 'src/utils/utils-query';
import { LIST_ITEM_TYPE } from '..';
import { listTags } from './FilterSearch';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import rf from 'src/requests/RequestFactory';

interface IListItem {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  item?: IDashboardDetail | IQuery;
  visibility?: 'COLUMN' | 'ROW';
}

const listNetworkCurrency = ['eth_goerli', 'bsc_testnet', 'polygon_mainet'];

const ListItem: React.FC<IListItem> = (props) => {
  const { type, item, visibility } = props;
  const history = useHistory();

  // const [favorite, setFavorite] = useState<boolean>(false);

  const itemClass =
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? new Dashboard(item as IDashboardDetail)
      : new Query(item as IQuery);

  const getTitleUrl = (): string => {
    switch (type) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        return `${ROUTES.DASHBOARD}/${itemClass.getId()}/`;
      case LIST_ITEM_TYPE.QUERIES:
        return `${ROUTES.QUERY}/${itemClass.getId()}`;
      default:
        return ROUTES.HOME;
    }
  };

  const onClickFork = async () => {
    try {
      let res;
      if (type === LIST_ITEM_TYPE.DASHBOARDS) {
        res = await rf
          .getRequest('DashboardsRequest')
          .forkDashboard(
            { newDashboardName: `Forked from ${itemClass.getName()}` },
            itemClass.getId(),
          );
      } else if (type === LIST_ITEM_TYPE.QUERIES) {
        res = await rf
          .getRequest('DashboardsRequest')
          .forkQueries(itemClass.getId());
      }

      if (res) {
        history.push(
          `${
            type === LIST_ITEM_TYPE.DASHBOARDS ? ROUTES.DASHBOARD : ROUTES.QUERY
          }/${res.id}`,
        );
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
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
          <MenuItem onClick={onClickFork} className="menu-info">
            <IconFork /> Fork
          </MenuItem>
          <MenuItem className="menu-info">
            <IconShare /> Share
          </MenuItem>
        </MenuList>
      </Menu>
    );
  };

  const _renderGridItem = () => {
    return (
      <div className="dashboard-list__item--column">
        <Flex flexDirection="column" alignItems={'center'}>
          <div className="dashboard-list__item--column__avatar">
            <Link to={getTitleUrl()}>
              <img
                src="/images/ThumnailDashboard.png"
                alt="thumbnail"
                className="thumbnail"
              />
            </Link>
            {/* <div className="dashboard-list__item--column__box-favourite">
              {favorite ? (
                <IconHeartFavorite onClick={() => setFavorite((pre) => !pre)} />
              ) : (
                <IconHeart onClick={() => setFavorite((pre) => !pre)} />
              )}
              25
            </div> */}
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
                <Flex flexWrap={'wrap'} flexDirection={'row'} maxW={52}>
                  {listTags.map((item) => (
                    <div key={item.id} className="tag-name">
                      {Tag({ value: item.name })}
                    </div>
                  ))}
                </Flex>
              </Flex>
              <div>{_renderDropdown()}</div>
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
                  <Text>
                    {moment(itemClass.getCreatedTime()).format('YYYY MMMM Do')}
                  </Text>
                </div>
              </Flex>
              <AppNetworkIcons networkIds={listNetworkCurrency} />
            </Flex>
          </div>
        </Flex>
      </div>
    );
  };

  const _renderRowItem = () => {
    return (
      <div className="dashboard-list__item--row">
        <Flex flexDirection="row" alignItems={'center'}>
          <Link
            to={getTitleUrl()}
            className="dashboard-list__item--row__avatar"
          >
            {type === LIST_ITEM_TYPE.DASHBOARDS && (
              <img
                src="/images/ThumnailDashboard.png"
                alt="thumbnail"
                className="thumbnail"
              />
            )}

            <div className="item-name">{itemClass.getName()}</div>
          </Link>
          <div className="item-desc">
            <img src="/images/AvatarDashboardCard.png" alt="avatar" />
            <p>Tyler Covington</p>
          </div>
          <div className="item-chain">
            <AppNetworkIcons networkIds={listNetworkCurrency} />
          </div>
          <div className="item-date">
            {moment(itemClass.getCreatedTime()).format('YYYY MMMM Do')}
          </div>
          <div className="item-tag">
            {listTags.map((item) => (
              <div key={item.id} className="tag-name">
                {Tag({ value: item.name })}
              </div>
            ))}
          </div>
          {/* <div className="item-favorite">
            {favorite ? (
              <IconHeartFavorite onClick={() => setFavorite((pre) => !pre)} />
            ) : (
              <IconHeart onClick={() => setFavorite((pre) => !pre)} />
            )}
            25
          </div> */}
          <div className="item-btn-options">{_renderDropdown()}</div>
        </Flex>
      </div>
    );
  };

  return (
    <>
      {visibility === VisibilityGridDashboardList.COLUMN
        ? _renderGridItem()
        : _renderRowItem()}
    </>
  );
};

const Tag: React.FC<{ value: string }> = ({ value }) => {
  return (
    <Link to={'/'} target={'_blank'}>
      #{value}
    </Link>
  );
};

export default ListItem;
