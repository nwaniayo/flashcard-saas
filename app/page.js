'use client'

import React, { useState } from 'react';
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button, Container, AppBar, Typography, Toolbar, Box, Grid, Link, Paper, ThemeProvider, createTheme, CssBaseline, Drawer, List, ListItem, ListItemText, Divider, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Head from "next/head";

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

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isSignedIn } = useUser();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSubmit = async () => {
    if (!isSignedIn) {
      // Redirect to sign-in page if not signed in
      window.location.href = '/sign-in';
      return;
    }

    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    });
    const checkoutSessionJson = await checkoutSession.json();
    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Head>
          <title>FlashCards Gen</title>
          <meta name="description" content="Create flashcard from your text" />
        </Head>

        <AppBar position="sticky" sx={{
          background: 'linear-gradient(90deg, #141c3a 0%, #1f2b4d 100%)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
          <Toolbar>
            <SignedIn>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </SignedIn>
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
          <SignedIn>
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
          </SignedIn>

          <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
            <Box sx={{
              textAlign: 'center',
              mb: 6,
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}>
              <Typography variant="h2" gutterBottom>Welcome to FlashCards Gen</Typography>
              <Typography variant="h5" gutterBottom>
                The easiest way to generate flashcards from your texts
              </Typography>
              
                <Button 
                  variant="contained" 
                  sx={{
                    mt: 2,
                    backgroundColor: '#6400e4',
                    '&:hover': {
                      backgroundColor: '#5000b8',
                    },
                    borderRadius: '20px',
                    padding: '10px 20px',
                    textTransform: 'none',
                  }}
                  component="button"
                  onClick={() => {
                    if (!isSignedIn) {
                      window.location.href = '/sign-in';
                    } else {
                      window.location.href = '/generate';
                    }
                  }}
                >
                  Get Started
                </Button>
              
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Features
              </Typography>
              <Grid container spacing={4}>
                {[
                  { title: "Easy to use", description: "Just paste your text and click generate" },
                  { title: "Smart Flashcards", description: "Our AI intelligently generates flashcards from your text" },
                  { title: "Accessible anywhere", description: "Access them from anywhere. Study on the go with these" }
                ].map((feature, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Paper elevation={3} sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      backgroundColor: 'background.paper',
                      borderRadius: '8px',
                    }}>
                      <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                      <Typography>{feature.description}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Pricing
              </Typography>
              <Grid container justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                  <Paper elevation={3} sx={{
                    p: 4,
                    backgroundColor: 'background.paper',
                    borderRadius: 4,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}>
                    <Typography variant="h5" gutterBottom>
                      Pro
                    </Typography>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                      $10/month
                    </Typography>
                    <Typography gutterBottom>
                      Unlimited flashcards and storage with priority support
                    </Typography>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        mt: 2,
                        backgroundColor: '#6400e4',
                        '&:hover': {
                          backgroundColor: '#5000b8',
                        },
                      }}
                      onClick={handleSubmit}
                    >
                      Choose Pro
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}