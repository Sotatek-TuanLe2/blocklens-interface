import { Flex, Td, Tr } from '@chakra-ui/react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import useUser from 'src/hooks/useUser';
import { LIST_ITEM_TYPE } from '..';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

interface IMember {
  id: number;
  name: string;
  avatar: string;
}

interface IListItem {
  id: string | number;
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  title: string;
  createdAt?: Date;
  author: string;
  tags?: string[]; // used for dashboards and queries
  members?: IMember[]; // used for teams
}

const ListItem: React.FC<IListItem> = (props) => {
  const { id, type, title, createdAt, author, tags, members } = props;

  const { user } = useUser();

  const getDuration = (): string => {
    const durationMinutes = moment().diff(moment(createdAt), 'minutes');
    if (durationMinutes < 60) {
      return `${durationMinutes} minute(s)`;
    }
    const durationHours = moment().diff(moment(createdAt), 'hours');
    if (durationHours < 24) {
      return `${durationHours} hour(s)`;
    }
    const durationDays = moment().diff(moment(createdAt), 'days');
    if (durationDays < 30) {
      return `${durationDays} day(s)`;
    }
    const durationMonths = moment().diff(moment(createdAt), 'months');
    if (durationMonths < 30) {
      return `${durationMonths} month(s)`;
    }
    const durationYears = moment().diff(moment(createdAt), 'years');
    return `${durationYears} year(s)`;
  };

  const getTitleUrl = (): string => {
    switch (type) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        return `/dashboard/${id}/`;
      case LIST_ITEM_TYPE.QUERIES:
        return `/queries/${id}`;
      default:
        return '/dashboards';
    }
  };

  const _renderSubContent = () => {
    if (type === LIST_ITEM_TYPE.DASHBOARDS || type === LIST_ITEM_TYPE.QUERIES) {
      return (
        <div className="dashboard-list__item__sub__content">
          Created by{' '}
          <Link
            className="dashboard-list__item__sub__content__link"
            to={`/${author}`}
            target="_blank"
          >
            @{author}
          </Link>
          <span> &nbsp;</span>
          {getDuration()} ago
        </div>
      );
    }
    return <>Created </>;
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
            <Jazzicon diameter={40} seed={jsNumberForAddress(id.toString())} />
          </div>
          <div className="dashboard-list__item__content">
            <Flex
              className="dashboard-list__item__content__title"
              alignItems={'center'}
            >
              <Link className="item-name" to={getTitleUrl()}>
                {title}
              </Link>
              {tags && (
                <span className="tag-name">
                  {tags.map((tag) => (
                    <Tag key={tag} value={tag} />
                  ))}
                </span>
              )}
              {members && (
                <Flex>
                  {members.map((member) => (
                    <Link
                      key={member.id}
                      className="item-member-image"
                      to={`/`}
                      target={'_blank'}
                    >
                      <img
                        src={member.avatar}
                        alt={`Avatar of ${member.name}`}
                      />
                    </Link>
                  ))}
                </Flex>
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
