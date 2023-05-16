import { Flex, Td, Tr } from '@chakra-ui/react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { LIST_ITEM_TYPE } from '..';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Dashboard, DashboardInterface } from 'src/utils/utils-dashboard';
import { Query, QueryInterface } from 'src/utils/utils-query';

interface IMember {
  id: number;
  name: string;
  avatar: string;
}

interface IListItem {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  item: DashboardInterface | QueryInterface;
}

const ListItem: React.FC<IListItem> = (props) => {
  const { type, item } = props;

  const itemClass =
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? new Dashboard(item as DashboardInterface)
      : new Query(item as QueryInterface);

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

  const _renderSubContent = () => {
    return (
      <div className="dashboard-list__item__sub__content">
        Created
        <span> &nbsp;</span>
        {moment(itemClass.getCreatedTime()).fromNow()}
      </div>
    );
  };

  return (
    <Tr>
      <Td border={'none'} padding={0}>
        <Flex
          flexDirection="row"
          className="dashboard-list__item"
          alignItems={'center'}
        >
          <div className="dashboard-list__item__avatar">
            <Jazzicon
              diameter={40}
              seed={jsNumberForAddress(itemClass.getId().toString())}
            />
          </div>
          <div className="dashboard-list__item__content">
            <Flex
              className="dashboard-list__item__content__title"
              alignItems={'center'}
            >
              <Link className="item-name" to={getTitleUrl()}>
                {itemClass.getName()}
              </Link>
              {itemClass.getTags() && (
                <span className="tag-name">
                  {itemClass.getTags().map((tag) => (
                    <Tag key={tag} value={tag} />
                  ))}
                </span>
              )}
            </Flex>
            <div className="dashboard-list__item__content__createAt">
              {_renderSubContent()}
            </div>
          </div>
        </Flex>
      </Td>
    </Tr>
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
