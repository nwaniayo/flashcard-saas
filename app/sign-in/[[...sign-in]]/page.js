'use client'
import { SignIn } from '@clerk/nextjs';
import { Container, Typography, Button, AppBar, Toolbar, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Link from 'next/link';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6400e4',
    },
    background: {
      default: '#141c3a',
      paper: '#1f2b4d',
    },
  },
});

export default function SignInPage() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar position="sticky" sx={{
                    background: 'linear-gradient(90deg, #141c3a 0%, #1f2b4d 100%)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            <Link href="/" passHref style={{ textDecoration: 'none', color: 'white' }}>
                                FlashCard SaaS
                            </Link>
                        </Typography>
                        <Button color="inherit" component={Link} href="/sign-in">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} href="/sign-up">
                            Sign Up
                        </Button>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 4,
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}>
                        
                        <SignIn />
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    )
}