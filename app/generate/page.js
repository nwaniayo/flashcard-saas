'use client';
import { useUser } from '@clerk/nextjs';
import { writeBatch } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import {
  Card,
  Grid,
  Paper,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  DialogTitle,
  DialogContentText,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Link,

} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

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

const drawerWidth = 240;

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashCards] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(false); // New state for loading
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading
    fetch('/api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then(data => {
        setFlashCards(data);
        setLoading(false); // Stop loading when data is received
      })
      .catch(() => setLoading(false)); // Stop loading in case of an error
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashCards = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }
    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert('Flashcard collection with the same name exists.');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };

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
          <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ mb: 4, color: 'white', textShadow: '0 0 10px rgba(100, 0, 228, 0.5)' }}>
                Generate Flashcards
              </Typography>
              <Paper sx={{ 
                p: 3, 
                width: '100%', 
                borderRadius: 2, 
                background: 'linear-gradient(145deg, rgba(31,43,77,0.6) 0%, rgba(20,28,58,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}>
                <TextField
                  label="Enter flashcard topic"
                  multiline
                  fullWidth
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6400e4',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
                <Button 
                  variant="contained" 
                  fullWidth 
                  color="primary" 
                  sx={{ 
                    mt: 2,
                    background: 'linear-gradient(45deg, #6400e4 30%, #8a29ff 90%)',
                    boxShadow: '0 3px 5px 2px rgba(100, 0, 228, .3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5600c4 30%, #7a19ef 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 10px 4px rgba(100, 0, 228, .4)',
                    },
                  }} 
                  onClick={handleSubmit}
                >
                  Generate
                </Button>
              </Paper>
            </Box>

            {loading ? (
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
                  Generating Flashcards...
                </Typography>
              </Box>
            ) : (
              flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Grid container spacing={3}>
                    {flashcards.map((flashcard, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{
                          height: '100%',
                          background: 'linear-gradient(145deg, rgba(31,43,77,0.8) 0%, rgba(20,28,58,0.9) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          //boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                          },
                        }}>
                          <CardActionArea onClick={() => handleCardClick(index)} sx={{ height: '100%' }}>
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
                                  transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="secondary" onClick={handleOpen}>
                      Save
                    </Button>
                  </Box>
                </Box>
              )
            )}

            <Dialog 
              open={open} 
              onClose={handleClose}
              PaperProps={{
                style: {
                  background: 'linear-gradient(145deg, rgba(31,43,77,0.8) 0%, rgba(20,28,58,0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                },
              }}
            >
              <DialogTitle sx={{ color: 'white', textShadow: '0 0 10px rgba(100, 0, 228, 0.5)' }}>Save Flashcards</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Please enter a name for the collection
                </DialogContentText>
                <TextField
                  autoFocus
                  margin='dense'
                  label="Collection name"
                  fullWidth
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6400e4',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />   
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Cancel
                </Button>
                <Button 
                  onClick={saveFlashCards} 
                  sx={{
                    color: 'white',
                    background: 'linear-gradient(45deg, #6400e4 30%, #8a29ff 90%)',
                    boxShadow: '0 3px 5px 2px rgba(100, 0, 228, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5600c4 30%, #7a19ef 90%)',
                    },
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}