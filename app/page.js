import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button, Container, AppBar, Typography, Toolbar, Box, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
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
          <Typography variant="h2" align="center" gutterBottom>Welcome to Flashcard SaaS</Typography>
          <Typography variant="h5" align="center" gutterBottom>
            The easiest way to generate flashcards from your texts
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Get Started
          </Button>
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
          
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid #ccc',
                borderRadius: 2,
                borderColor: 'grey.300',
              }}>
              
              <Typography variant="h5" gutterBottom>
                Basic
              </Typography>
              <Typography gutterBottom>
                $5/month
              </Typography>
              <Typography gutterBottom>
                {''}
                Access to basic features
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
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
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
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