'use client'

import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button, Container, AppBar, Typography, Toolbar, Box, Grid, Link } from "@mui/material";
import Head from "next/head";
import Stripe from "stripe";


export default function Home() {

  const handleSubmit = async ()=>{
    const checkoutSession = await fetch ('/api/checkout_session', {
      method: 'POST',
      headers:{
        origin: 'http://localhost:3000',
      },
    })
    const checkoutSessionJson = await checkoutSession.json()
    if (checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error){
      console.warn(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>FlashCards Gen </title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link href="/" passHref style={{ textDecoration: 'none', color: 'white' }}>
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

      <Container maxWidth="lg">
        <Box sx={{
          textAlign: 'center',
          my: 4,
          pt: 8, // Add padding top to account for AppBar height
        }}>
          <Typography variant="h2" align="center" gutterBottom>Welcome to FlashCards Gen</Typography>
          <Typography variant="h5" align="center" gutterBottom>
            The easiest way to generate flashcards from your texts
          </Typography>
          <SignedIn>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              <Link href="/generate" passHref style={{ textDecoration: 'none', color: 'white' }}>
                Get Started
              </Link>
            </Button>
          </SignedIn>
        </Box>
        <Box sx={{
          textAlign: 'center',
          my: 6,
        }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">Easy to use</Typography>
              <Typography>
                Just paste your text and click generate
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">Smart Flashcards</Typography>
              <Typography>
                Our AI intelligently generates flashcards from your text
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">Accessible anywhere</Typography>
              <Typography>
                Access them from anywhere. Study on the go with these
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{my: 6, textAlign: 'center'}}>
           <Typography variant="h4" component="h2" gutterBottom>
                Pricing
        </Typography>
        <Grid container spacing={4}>
          
          <Grid item xs={12} sm={12}>
            <Box
              sx={{
                p: 3,
                border: '1px solid #ccc',
                borderRadius: 2,
                borderColor: 'grey.300',
              }}>
              <Typography variant="h5" gutterBottom>
                Pro
              </Typography>
              <Typography gutterBottom>
                $10/month
              </Typography>
              <Typography gutterBottom>
                {''}
                Unlimited flashcards and storage with priority support
              </Typography>
              <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Box>
          </Grid>
          
        </Grid>
        </Box>
      </Container>
    </>
  )
}