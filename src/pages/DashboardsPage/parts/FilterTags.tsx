import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import rf from 'src/requests/RequestFactory';
import { INSIGHTS_TABS } from '..';
import { TagIcon } from 'src/assets/icons';
import { ROUTES } from 'src/utils/common';

interface IFilterTags {
  type: typeof INSIGHTS_TABS[keyof typeof INSIGHTS_TABS];
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

  const searchParams = new URLSearchParams(searchUrl);

  const fetchTags = async (type: string) => {
    const tags =
      type === INSIGHTS_TABS.DASHBOARDS
        ? await rf.getRequest('InsightsRequest').getPopularDashboardTags()
        : await rf.getRequest('InsightsRequest').getPopularQueryTags();
    setTags(tags);
  };

  useEffect(() => {
    fetchTags(type);
  }, [type]);

  useEffect(() => {
    const selectedTag = searchParams.get('tags') || '';
    setSelectedTag(selectedTag);
  }, [searchUrl]);

  const getTagUrl = (tag: string) => () => {
    searchParams.delete('tags');
    searchParams.set('tags', tag);
    return `${ROUTES.HOME}?${searchParams.toString()}`;
  };

  return (
    <div className="dashboard-filter__tags">
      <div className="dashboard-filter__tags__title">
        Popular {type === INSIGHTS_TABS.DASHBOARDS ? 'dashboard' : 'query'} tags
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
