'use client';

import { useRouter } from 'next/navigation'; // This is correct for Next.js 13+
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { Container, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
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
        }
        getFlashCards();
    }, [user]);

    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>; // It's better to show a loading indicator
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    }

    return (
        <Container maxWidth="100vw"> 
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => ( // Removed unused 'index' parameter
                    <Grid item xs={12} sm={6} md={4} key={flashcard.name}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h5">{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}