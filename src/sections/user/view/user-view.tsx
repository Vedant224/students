import { useState, useEffect , useCallback } from 'react';
import {  doc, addDoc, getDocs, updateDoc, deleteDoc , collection} from 'firebase/firestore';

import { db } from 'src/firebase'; // Adjust the import path to your firebase.ts file

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<UserProps>({
    id: '',
    name: '',
    class: '',
    section: '',
    rollno: '',
    subject: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    parentName: '',
  });
  const [students, setStudents] = useState<UserProps[]>([]);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch students from Firestore
  const fetchStudents = useCallback(async () => {
    setLoading(true); // Ensure loading state updates properly
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const studentsData = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as UserProps[];
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students: ', error);
      setTimeout(fetchStudents, 5000); // Retry after 5 seconds
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array to prevent recreation
  
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]); // Depend on the memoized function

  const dataFiltered: UserProps[] = applyFilter({
    inputData: students,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpenModal = () => {
    setOpenModal(true);
    setEditStudentId(null);
    setFormData({
      id: '',
      name: '',
      class: '',
      section: '',
      rollno: '',
      subject: '',
      email: '',
      phone: '',
      address: '',
      dob: '',
      gender: '',
      parentName: '',
    });
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editStudentId) {
        // Update existing student
        const studentRef = doc(db, 'students', editStudentId);
        await updateDoc(studentRef, formData);
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === editStudentId ? { ...student, ...formData } : student
          )
        );
      } else {
        // Add new student
        const docRef = await addDoc(collection(db, 'students'), formData);
        setStudents((prevStudents) => [...prevStudents, { ...formData, id: docRef.id }]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error adding/updating document: ', error);
    }
  };

  const handleEdit = (student: UserProps) => {
    setFormData(student);
    setEditStudentId(student.id);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'students', id));
      // Refresh the student list
      await fetchStudents();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Students
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenModal}
        >
          Add Student
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={students.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                headLabel={[
                  { id: 'id', label: 'ID' },
                  { id: 'name', label: 'Name' },
                  { id: 'class', label: 'Class' },
                  { id: 'section', label: 'Section' },
                  { id: 'rollno', label: 'Roll Number' },
                  { id: 'action', label: 'Action' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      onEdit={() => handleEdit(row)}
                      onDelete={() => handleDelete(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, students.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={students.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            {editStudentId ? 'Edit Student' : 'Add Student'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <TextField fullWidth label="Id" name="id" value={formData.id} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="Class" name="class" value={formData.class} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="Section" name="section" value={formData.section} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="Roll Number" type='number' name="rollno" value={formData.rollno} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} margin="normal" />
              <TextField fullWidth label="Email" name="email" type='email' value={formData.email} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="Phone" name="phone" type='number' value={formData.phone} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="" name="dob" type='date'  value={formData.dob} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="Parent Name" name="parentName" value={formData.parentName} onChange={handleInputChange} margin="normal" required />
            </Box>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {editStudentId ? 'Update' : 'Submit'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}