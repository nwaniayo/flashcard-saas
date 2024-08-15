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
          <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ mb: 4 }}>
                Generate Flashcards
              </Typography>
              <Paper sx={{ p: 3, width: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <TextField
                  label="Enter text"
                  multiline
                  fullWidth
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" fullWidth color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
                  Generate
                </Button>
              </Paper>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <CircularProgress />
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
                          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
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

            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Save Flashcards</DialogTitle>
              <DialogContent>
                <DialogContentText>
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
                  sx={{ mb: 2 }}
                />   
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={saveFlashCards} color="primary">
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