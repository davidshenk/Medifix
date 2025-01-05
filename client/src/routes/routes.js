import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import CategoryIcon from '@mui/icons-material/Category';
import { Roles } from '../constant';

const clientRoutes = [
  [
    {
      id: 1,
      text: 'My Service Calls',
      icon: <ListAltIcon />,
      path: '/serviceCalls',
    },
    {
      id: 2,
      text: 'Open Service Call',
      icon: <AddIcCallIcon />,
      path: '/serviceCalls/new',
    },
  ],
];

const practitionerRoutes = [
  [
    {
      id: 1,
      text: 'Service Calls',
      icon: <ListAltIcon />,
      path: '/practitioner/serviceCalls',
    },
  ],
];

const managerRoutes = [
  [
    {
      id: 1,
      text: 'Dashboard',
      icon: <DashboardIcon  />,
      path: '/dashboard',
    },
  ],
  [
    {
      id: 2,
      text: 'Service Calls',
      icon: <ListAltIcon />,
      path: '/serviceCalls',
    },
    {
      id: 3,
      text: 'Open Service Call',
      icon: <AddIcCallIcon />,
      path: '/serviceCalls/new',
    },
  ],
  [
    {
      id: 4,
      text: 'Manage Users',
      icon: <PeopleIcon />,
      path: '/manage/users',
    },
    {
      id: 5,
      text: 'Practitioners',
      icon: <EngineeringIcon />,
      path: '/manage/practitioners',
    },
    {
      id: 6,
      text: 'Manage Locations',
      icon: <EditLocationAltIcon />,
      path: '/manage/locations',
    },
    {
      id: 7,
      text: 'Manage Categories',
      icon: <CategoryIcon />,
      path: '/manage/categories',
    },
  ],
];

export const getMenu = (userType) => {
  switch (userType) {
    case Roles.client:
      return clientRoutes;
    case Roles.manager:
      return managerRoutes;
    case Roles.practitioner:
      return practitionerRoutes;

    default:
      return [];
  }
};
