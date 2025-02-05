
import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

import { LogoutButton } from './components/logout-button';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [


  {
    title: 'User',
    path: '/',
    icon: icon('ic-user'),
  },
  {
    title: 'Log-out',
    path: '/sign-in',
    icon: icon('ic-lock'),
    component: <LogoutButton />
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
