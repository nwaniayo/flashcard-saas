import { SignUp } from '@clerk/nextjs';
import { Container, Typography, Button, AppBar, Toolbar, Box } from '@mui/material';
import Link from 'next/link';

export default function SignUpPage() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link href="/" passHref style={{ textDecoration: 'none', color: 'white' }}>
                    FlashCards Gen
                    </Link>
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

                    
                    <SignUp />
                </Box>
            </Container>
        </>
    )
}