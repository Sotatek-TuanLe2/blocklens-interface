import { Flex, Tr } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { StarIcon } from 'src/assets/icons';
import { LIST_ITEM_TYPE } from '..';

interface ListItem {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  title: string;
  createdAt: Date;
  avatarUrl: string;
  author: string;
  starCount: number;
  tags?: string[]; // used for dashboards and queries
  memberAvatarUrls?: string[]; // used for teams
}

const ListItem: React.FC<ListItem> = (props) => {
  const {
    type,
    title,
    createdAt,
    avatarUrl,
    author,
    starCount,
    tags,
    memberAvatarUrls,
  } = props;

  const LIKEABLE_ITEMS = [LIST_ITEM_TYPE.DASHBOARDS, LIST_ITEM_TYPE.QUERIES];

  const getDuration = () => {
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

  const onLike = () => {
    //
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
            <span className="item-name">{title}</span>
            {tags && (
              <span>
                {tags.map((tag) => (
                  <Tag key={tag} value={tag} />
                ))}
              </span>
            )}
          </Flex>
          <div className="dashboard-list__item__content__createAt">
            Created by @
            <Link to={`/${author}`} target="_blank">
              {author}
            </Link>{' '}
            {getDuration()} ago
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
            <StarIcon />
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
