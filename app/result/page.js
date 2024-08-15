'use client';
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Container, Typography, AppBar, Toolbar, IconButton, Button, Link, Drawer, List, ListItem, ListItemText, Divider, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const theme = createTheme({
  typography: {
    fontFamily: '"Apercu", "Roboto", "Helvetica", "Arial", sans-serif',
  },
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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#141c3a',
          color: '#ffffff',
          minHeight: '100vh',
        },
      },
    },
  },
});

const drawerWidth = 240;

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;

      try {
        const res = await fetch(`/api/checkout_session?session_id=${session_id}`);
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError("An error occurred while fetching the session");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          textAlign: "center",
          mt: 4
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          textAlign: "center",
          mt: 4
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="sticky" sx={{
          background: 'linear-gradient(90deg, #141c3a 0%, #1f2b4d 100%)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link href="/" underline="none" color="inherit">
                FlashCard SaaS
              </Link>
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">Login</Button>
              <Button color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: 'background.paper',
              },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                <ListItem button component={Link} href="/flashcards">
                  <ListItemText primary="Collections" />
                </ListItem>
                <ListItem button component={Link} href="/generate">
                  <ListItemText primary="Generate" />
                </ListItem>
              </List>
              <Divider />
            </Box>
          </Drawer>
          <Container
            maxWidth="100vw"
            sx={{
              textAlign: "center",
              mt: 4
            }}
          >
            {session.payment_status === "paid" ? (
              <>
                <Typography variant="h4">Payment successful!</Typography>
                <Typography variant="body1">Thank you for your purchase</Typography>
                <Box mt={2}>
                  <Typography variant="h6">Session ID: {session_id}</Typography>
                  <Typography variant="body1">
                    We have sent you an email with the details of your purchase.
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h4">Payment failed!</Typography>
                <Box mt={2}>
                  <Typography variant="h6">Session ID: {session_id}</Typography>
                  <Typography variant="body1">
                    Your payment was not successful. Please try again.
                  </Typography>
                </Box>
              </>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ResultPage;