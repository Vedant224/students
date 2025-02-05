import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import { useLogout } from 'src/hooks/useLogout';

import { SvgColor } from 'src/components/svg-color';

const icon = (name: string) => (
    <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
  );

export function LogoutButton() {
  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleLogout();
    }
  };

  return (
    <ListItem disableGutters disablePadding>
      <ListItemButton
        disableGutters
        onClick={handleLogout}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        sx={{
          pl: 2,
          py: 1,
          gap: 2,
          pr: 1.5,
          borderRadius: 0.75,
          typography: 'body2',
          fontWeight: 'fontWeightMedium',
          color: 'var(--layout-nav-item-color)',
          minHeight: 'var(--layout-nav-item-height)',
          '&:hover': {
            bgcolor: 'var(--layout-nav-item-hover-bg)',
          },
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24 }}>
        {icon('ic-lock')}
          {/* Example: <LogoutIcon /> */}
        </Box>

        <Box component="span" flexGrow={1}>
          Log-out
        </Box>
      </ListItemButton>
    </ListItem>
  );
}