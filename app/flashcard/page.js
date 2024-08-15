'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  Box,
  Container,
  Typography,
  CardActionArea,
  CardContent,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export default function Flashcard() {
  const [flashcards, setFlashCards] = useState([]);
  const [flipped, setFlipped] = useState({});
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
    }
    getFlashCard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
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
    </Container>
  );
}