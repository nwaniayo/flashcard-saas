import { SignIn } from '@clerk/nextjs';
import { Container, Typography, Button, AppBar, Toolbar, Box } from '@mui/material';
import Link from 'next/link';

export default function SignInPage() {
    return (
        <Container maxWidth="sm">
            <AppBar position="static" >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Flashcard SaaS
                    </Typography>
                    <Button color="inherit">
                        <Link href="/sign-in" passHref>
                            Login
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/sign-up" passHref>
                            Sign Up
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'>

                <Typography variant="h4" gu>
                    Sign In
                </Typography>
                <SignIn />
            </Box>
        </Container>
    )
}
