'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import { Toolbar, Container, Grid, Typography, Card, CardActionArea, CardContent, CircularProgress, Box, ThemeProvider, createTheme, CssBaseline, Drawer, List, ListItem, ListItemText, Divider, IconButton, AppBar, Button, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

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

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getFlashCards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
      setLoading(false);
    }
    getFlashCards();
  }, [user]);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (!isLoaded || !isSignedIn) {
    return <CircularProgress />;
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
                FlashCards Gen
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
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 4 }}>Your Flashcard Collections</Typography>
              {loading ? (
                <CircularProgress />
              ) : (
                <Grid container spacing={3}>
                  {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.name}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(145deg, rgba(31,43,77,0.8) 0%, rgba(20,28,58,0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                        },
                      }}>
                        <CardActionArea onClick={() => handleCardClick(flashcard.name)} sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h5">{flashcard.name}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
