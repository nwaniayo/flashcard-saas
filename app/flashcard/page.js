'use client';
import { useState, useEffect } from 'react';
import { Toolbar, Card, Grid, Box, Container, Typography, CardActionArea, CardContent, CircularProgress, ThemeProvider, createTheme, CssBaseline, Drawer, List, ListItem, ListItemText, Divider, IconButton, AppBar, Button, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useSearchParams } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useUser } from '@clerk/nextjs';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

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

export default function Flashcard() {
  const [flashcards, setFlashCards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const searchParams = useSearchParams();
  const search = searchParams.get('id');

  useEffect(() => {
    async function getFlashCard() {
      if (!search || !user) return;
      const colRef = collection(doc(db, 'users', user.id), search);
      const querySnapshot = await getDocs(colRef);
      const newFlashcards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFlashCards(newFlashcards);
      setLoading(false);
    }
    getFlashCard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const CustomCircularProgress = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      mt: 4,
      height: '200px',
    }}>
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: 'primary.main',
          animation: 'pulse 1.5s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(0.8)',
              //boxShadow: '0 0 0 0 rgba(100, 0, 228, 0.7)',
            },
            '70%': {
              transform: 'scale(1)',
              //boxShadow: '0 0 0 10px rgba(100, 0, 228, 0)',
            },
            '100%': {
              transform: 'scale(0.8)',
             // boxShadow: '0 0 0 0 rgba(100, 0, 228, 0)',
            },
          },
        }}
      />
      <Typography 
        variant="h6" 
        sx={{ 
          mt: 2, 
          color: 'primary.main',
          textShadow: '0 0 10px rgba(100, 0, 228, 0.5)',
          animation: 'fadeInOut 1.5s ease-in-out infinite',
          '@keyframes fadeInOut': {
            '0%, 100%': { opacity: 0.6 },
            '50%': { opacity: 1 },
          },
        }}
      >
        Retriving Flashcards...
      </Typography>
    </Box>
  );
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
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                background: 'linear-gradient(135deg, rgba(31, 43, 77, 0.7) 0%, rgba(20, 28, 58, 0.7) 100%)',
                backdropFilter: 'blur(10px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.05)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
                  pointerEvents: 'none',
                },
              },
            }}
          >
            <Toolbar sx={{ 
              background: 'linear-gradient(180deg, rgba(31, 43, 77, 0.9) 0%, rgba(20, 28, 58, 0.9) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }} />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                {['Collections', 'Generate'].map((text, index) => (
                  <ListItem 
                    key={text} 
                    button 
                    component={Link} 
                    href={index === 0 ? "/flashcards" : "/generate"}
                    sx={{
                      color: 'white',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        backgroundColor: 'rgba(20, 28, 58, 0.8)', // Darker background color
                        '&::after': {
                          opacity: 1,
                        },
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                      },
                    }}
                  >
                    <ListItemText 
                      primary={text} 
                      primaryTypographyProps={{ 
                        fontWeight: 'medium',
                        sx: {
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                          },
                        }
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            </Box>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 4 }}>Flashcards: {search}</Typography>
              {loading ? (
                <CustomCircularProgress />
              ) : (
                <Grid container spacing={4}>
                  {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
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
                        <CardActionArea onClick={() => handleCardClick(flashcard.id)} sx={{ height: '100%' }}>
                          <CardContent>
                            <Box sx={{
                              perspective: '1000px',
                              height: '200px',
                            }}>
                              <Box sx={{
                                transition: 'transform 0.6s',
                                transformStyle: 'preserve-3d',
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                              }}>
                                <Box sx={{
                                  position: 'absolute',
                                  width: '100%',
                                  height: '100%',
                                  backfaceVisibility: 'hidden',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: 2,
                                  boxSizing: 'border-box',
                                }}>
                                  <Typography variant="h5" component="div">
                                    {flashcard.front}
                                  </Typography>
                                </Box>
                                <Box sx={{
                                  position: 'absolute',
                                  width: '100%',
                                  height: '100%',
                                  backfaceVisibility: 'hidden',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: 2,
                                  boxSizing: 'border-box',
                                  transform: 'rotateY(180deg)',
                                }}>
                                  <Typography variant="h5" component="div">
                                    {flashcard.back}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
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