import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
// import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;        
  name: string;
  class: string;    
  section: string;
  rollno: string;     
  subject: string;
  email: string;
  phone: string;        
  address: string;
  dob: string;            
  gender: string;
  parentName: string;
};


type UserTableRowProps = {
  row: UserProps;
  // selected: boolean;
  // onSelectRow: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function UserTableRow({ row, onEdit, onDelete }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  // const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
  //   setOpenPopover(event.currentTarget);
  // }, []);

  const handleClosePopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">

        <TableCell>{row.id}</TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.class}</TableCell>

        <TableCell>{row.section}</TableCell>

        <TableCell>{row.rollno}</TableCell>

        <TableCell align="right">
          <Box display="flex" gap={1} justifyContent="flex-start">
            <IconButton onClick={onEdit}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
            <IconButton onClick={onDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={onEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}