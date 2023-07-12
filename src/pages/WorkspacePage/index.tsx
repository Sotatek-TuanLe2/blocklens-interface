import { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BasePage } from 'src/layouts';
import { ROUTES } from 'src/utils/common';
import Dashboard from './parts/Dashboard';
import Query from './parts/Query';
import Sidebar from './parts/Sidebar';
import 'src/styles/pages/WorkspacePage.scss';
import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { AppButton } from 'src/components';
import { IconFilter } from 'src/assets/icons';

export const WORKSPACE_TYPES = {
  DASHBOARD: 'dashboard',
  QUERY: 'query',
};

const WorkspacePage: React.FC = () => {
  const { pathname } = useLocation();
  const history = useHistory();

  const [toggleExpandSidebar, setToggleExpandSidebar] = useState<boolean>(true);

  const type = useMemo(() => {
    if (pathname.includes(ROUTES.MY_DASHBOARD)) {
      return WORKSPACE_TYPES.DASHBOARD;
    }
    return WORKSPACE_TYPES.QUERY;
  }, [pathname]);

  const onToggleExpandSidebar = (toggle?: boolean) => {
    setToggleExpandSidebar((prevState) => toggle || !prevState);
    // resize widgets in dashboard
    setTimeout(() => window.dispatchEvent(new Event('resize')), 500);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const _renderNavSidebar = () => {
    return (
      <Flex align={'center'} justifyContent={'space-between'} py={5}>
        <Tooltip label="Back" hasArrow placement="top" bg="white" color="black">
          <AppButton
            onClick={() => history.goBack()}
            size="sm"
            w={'38px'}
            h={'38px'}
            variant="no-effects"
            className="icon-back-light"
          />
        </Tooltip>
        <Button
          bg="white !important"
          color={'#C7D2E1'}
          variant="outline"
          w={'38px'}
          h={'38px'}
          px={0}
          onClick={onOpen}
        >
          <IconFilter color={'rgba(0, 2, 36, 0.5)'} />
        </Button>
      </Flex>
    );
  };

  const _renderDrawerSidebar = () => {
    return (
      <Drawer isOpen={isOpen} placement="top" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <Sidebar onCloseFilter={onClose} />
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <BasePage>
      <>
        <Box display={{ lg: 'none' }} mt={'-30px'}>
          {_renderNavSidebar()}
        </Box>
        <div
          className={`${
            type === WORKSPACE_TYPES.QUERY ? 'workspace-page__query' : ''
          } workspace-page`}
        >
          <Box display={{ base: 'none', lg: 'block' }}>
            {type === WORKSPACE_TYPES.QUERY && (
              <Sidebar
                expandSidebar={toggleExpandSidebar}
                onToggleExpandSidebar={onToggleExpandSidebar}
              />
            )}
          </Box>
          <Box display={{ lg: 'none' }}>{_renderDrawerSidebar()}</Box>
          <div
            className={`workspace-page__editor ${
              type === WORKSPACE_TYPES.QUERY
                ? 'workspace-page__editor--query'
                : ''
            } ${toggleExpandSidebar ? '' : 'workspace-page__editor--expand'}`}
          >
            {type === WORKSPACE_TYPES.DASHBOARD ? <Dashboard /> : <Query />}
          </div>
        </div>
      </>
    </BasePage>
  );
};

export default WorkspacePage;
