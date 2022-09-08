import { SearchIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { FC, HTMLProps } from 'react';
import 'src/styles/components/AppSearch.scss';

interface AppSearchProps extends InputProps {
  className?: string;
  placeholder?: string;
  handleChange?: any;
}

const AppSearch: FC<AppSearchProps> = ({
  className = '',
  placeholder,
  value,
  handleChange,
  ...props
}: AppSearchProps) => {
  const searchIconColor = useColorModeValue('gray.700', 'white');
  return (
    <InputGroup className={`searchWrapper ${className}`}>
      <InputLeftElement
        className="leftIconWrapper"
        children={
          <IconButton
            className="searchButton"
            aria-label="search-icon"
            icon={<SearchIcon color={searchIconColor} className="searchIcon" />}
          />
        }
      />
      <Input
        className="searchInput"
        variant="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder ? placeholder : 'Search'}
        {...props}
      />
    </InputGroup>
  );
};

export default AppSearch;
