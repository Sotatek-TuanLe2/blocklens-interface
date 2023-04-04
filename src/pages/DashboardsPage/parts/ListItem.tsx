import { Flex, Tr } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { ActiveStarIcon, StarIcon } from 'src/assets/icons';
import { LIST_ITEM_TYPE } from '..';
import useUser from 'src/hooks/useUser';

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
  avatarUrl: string;
  author: string;
  starCount: number;
  tags?: string[]; // used for dashboards and queries
  members?: IMember[]; // used for teams
}

const ListItem: React.FC<IListItem> = (props) => {
  const {
    id,
    type,
    title,
    createdAt,
    avatarUrl,
    author,
    starCount,
    tags,
    members,
  } = props;

  const { user } = useUser();

  const LIKEABLE_ITEMS = [LIST_ITEM_TYPE.DASHBOARDS, LIST_ITEM_TYPE.QUERIES];

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
        return `/dashboard/${user?.getId()}/${title}`;
      case LIST_ITEM_TYPE.QUERIES:
        return `/queries/${id}`;
      default:
        return '/dashboards';
    }
  };

  const onLike = () => {
    //
  };

  const _renderSubContent = () => {
    if (type === LIST_ITEM_TYPE.DASHBOARDS || type === LIST_ITEM_TYPE.QUERIES) {
      return (
        <>
          Created by @
          <Link to={`/${author}`} target="_blank">
            {author}
          </Link>{' '}
          {getDuration()} ago
        </>
      );
    }
    if (type === LIST_ITEM_TYPE.WIZARDS) {
      return <>Wizard since </>;
    }
    return <>Created </>;
  };

  return (
    <Tr>
      <Flex className="dashboard-list__item" alignItems={'center'}>
        <div className="dashboard-list__item__avatar">
          <img src={avatarUrl} alt={`Avatar of ${author}`} />
        </div>
        <div className="dashboard-list__item__content">
          <Flex
            className="dashboard-list__item__content__title"
            alignItems={'center'}
          >
            <Link className="item-name" to={getTitleUrl()} target={'_blank'}>
              {title}
            </Link>
            {tags && (
              <span>
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
                    <img src={member.avatar} alt={`Avatar of ${member.name}`} />
                  </Link>
                ))}
              </Flex>
            )}
          </Flex>
          <div className="dashboard-list__item__content__createAt">
            {_renderSubContent()}
          </div>
        </div>
        <Flex
          className="dashboard-list__item__stars"
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <span>{starCount}</span>
          {LIKEABLE_ITEMS.includes(type) ? (
            <StarIcon onClick={onLike} />
          ) : (
            <ActiveStarIcon />
          )}
        </Flex>
      </Flex>
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
