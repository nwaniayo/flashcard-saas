'use client';
import { useUser } from '@clerk/nextjs';
import { writeBatch } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { collection, doc,setDoc, getDoc, collections } from 'firebase/firestore';
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
  DialogContentText
} from '@mui/material';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashCards] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(false); // New state for loading
  const router = useRouter();

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
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Generate Flashcards
        </Typography>
        <Paper sx={{ p: 2, width: '100%' }}>
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
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardActionArea onClick={() => handleCardClick(index)}>
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
      onClose={handleClose}>
        <DialogTitle>
        Save Flashcards
        </DialogTitle>  
      
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
  );
}
