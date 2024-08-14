import Image from "next/image"
import getStripe from "@/utils/get-stripe"
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import {Button, Container, AppBar, Typography, Toolbar } from "@mui/material";
import Head from "next/head";
export default function Home() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button> Login </Button>
            <Button> Sign Up </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
    </Container>
  )
}
