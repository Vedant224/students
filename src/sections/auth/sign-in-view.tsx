import { useState, FormEvent } from 'react';
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from 'src/firebase'; // Adjust the import path based on your project structure
import { useRouter } from 'src/routes/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// Define interfaces for better type checking
interface FormState {
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
}

export function SignInView(): JSX.Element {
  console.log('SignInView rendering');
  const router = useRouter();

  // Use a single state object for form-related state
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    showPassword: false,
    loading: false,
    error: '',
  });

  const handleSignIn = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, loading: true, error: '' }));

    try {
      await signInWithEmailAndPassword(auth, formState.email, formState.password);
      router.push('/');
    } catch (err) {
      const error = err as AuthError;
      setFormState((prev) => ({
        ...prev,
        error: 'Invalid email or password',
      }));
      console.error(error);
    } finally {
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleInputChange = (field: keyof Pick<FormState, 'email' | 'password'>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const togglePasswordVisibility = (): void => {
    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const renderForm = (
    <Box 
      component="form" 
      onSubmit={handleSignIn} 
      display="flex" 
      flexDirection="column" 
      alignItems="flex-end"
    >
      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={formState.email}
        onChange={handleInputChange('email')}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        required
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={formState.password}
        onChange={handleInputChange('password')}
        InputLabelProps={{ shrink: true }}
        type={formState.showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                <Iconify icon={formState.showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
        required
      />

      {formState.error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {formState.error}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        loading={formState.loading}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
      </Box>

      {renderForm}
{/* 
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider> */}
    </>
  );
}