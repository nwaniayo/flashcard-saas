import { SignIn } from '@clerk/nextjs';
import { Container, Typography, Button, AppBar, Toolbar, Box } from '@mui/material';
import Link from 'next/link';

export default function SignInPage() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        FlashCards Gen
                    </Typography>
                    <Button color="inherit">
                        <Link href="/sign-in" passHref style={{ textDecoration: 'none', color: 'white' }}>
                            Login
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/sign-up" passHref style={{ textDecoration: 'none', color: 'white' }}>
                            Sign Up
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm">
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'>

                    <Typography variant="h4" gutterBottom>
                        Sign In
                    </Typography>
                    <SignIn />
                </Box>
            </Container>
        </>
    )
}