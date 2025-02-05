import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Box } from '@mui/material';
import { CONFIG } from 'src/config-global';
import { SignInView } from 'src/sections/auth/sign-in-view';

export default function SignInPage() {
  useEffect(() => {
    console.log('SignInPage mounted');
  }, []);

  return (
    <>
      <Helmet>
        <title> {`Sign in - ${CONFIG.appName}`}</title>
      </Helmet>

      <Container maxWidth="sm">
        <Box
          // sx={{
          //   py: 12,
          //   maxWidth: 480,
          //   mx: 'auto',
          //   minHeight: '100vh',
          //   display: 'flex',
          //   justifyContent: 'center',
          //   flexDirection: 'column',
          // }}
        >
          <SignInView />
        </Box>
      </Container>
    </>
  );
}