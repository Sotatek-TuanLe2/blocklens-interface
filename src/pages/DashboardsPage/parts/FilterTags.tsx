import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import rf from 'src/requests/RequestFactory';
import { LIST_ITEM_TYPE } from '..';
import { TagIcon } from 'src/assets/icons';

interface IFilterTags {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
}

interface ITagResponse {
  tag: string;
  popularity: number;
}

const FilterTags: React.FC<IFilterTags> = (props) => {
  const { type } = props;
  const { search: searchUrl } = useLocation();
  const [tags, setTags] = useState<ITagResponse[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');

  const fetchTags = async (type: string) => {
    const tags =
      type === LIST_ITEM_TYPE.DASHBOARDS
        ? await rf.getRequest('DashboardsRequest').getPopularDashboardTags()
        : await rf.getRequest('DashboardsRequest').getPopularQueryTags();
    setTags(tags);
  };

  useEffect(() => {
    fetchTags(type);
  }, [type]);

  useEffect(() => {
    const searchParams = new URLSearchParams(searchUrl);
    const selectedTag = searchParams.get('tags') || '';
    setSelectedTag(selectedTag);
  }, [searchUrl]);

  if (type === LIST_ITEM_TYPE.WIZARDS || type === LIST_ITEM_TYPE.TEAMS) {
    return null;
  }

  const getTagUrl = (tag: string) => () => {
    const searchParams = new URLSearchParams(searchUrl);
    searchParams.delete('tags');
    searchParams.set('tags', tag);
    return `/dashboards?${searchParams.toString()}`;
  };

  return (
    <div className="dashboard-filter__tags">
      <div className="dashboard-filter__tags__title">
        Popular {type === LIST_ITEM_TYPE.DASHBOARDS ? 'dashboard' : 'query'}{' '}
        tags
      </div>
      <div className="dashboard-filter__tags__list">
        {tags.map((tag) => (
          <Flex
            key={tag.tag}
            justifyContent={'space-between'}
            alignItems="center"
          >
            <TagIcon />
            <Flex
              key={tag.tag}
              justifyContent={'space-between'}
              alignItems={'center'}
              className="dashboard-filter__tags__list__item"
            >
              <Link
                className={`dashboard-filter__tags__list__tag ${
                  tag.tag === selectedTag
                    ? 'dashboard-filter__tags__list__tag--selected'
                    : ''
                }`}
                to={getTagUrl(tag.tag)}
              >
                <div className="truncate" title={tag.tag}>
                  {tag.tag}
                </div>
              </Link>
              <span className="dashboard-filter__tags__list__popularity">
                {tag.popularity}
              </span>
            </Flex>
          </Flex>
        ))}
      </div>
    </div>
  );
};

export default FilterTags;
