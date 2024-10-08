// assets
import { DashboardOutlined , DatabaseOutlined, FundProjectionScreenOutlined, AppstoreOutlined} from '@ant-design/icons';


// icons
const icons = {
  DashboardOutlined, DatabaseOutlined, FundProjectionScreenOutlined, AppstoreOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: '나의 대시보드',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'mydrive',
      title: '나의 드라이브',
      type: 'item',
      url: '/mydrive',
      icon: icons.DatabaseOutlined,
      breadcrumbs: false
    },
    {
      id: 'sharedrive',
      title: '공유 드라이브',
      type: 'item',
      url: '/sample-page3',
      icon: icons.DatabaseOutlined,
      breadcrumbs: false
    },
    {
      id: 'project',
      title: '프로젝트',
      type: 'item',
      url: '/sample-page4',
      icon: icons.FundProjectionScreenOutlined,
      breadcrumbs: false
    },
  ]
};

export default dashboard;
