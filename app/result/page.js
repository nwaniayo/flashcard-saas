'use client'
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Container, Typography } from "@mui/material";

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id = searchParams.get("session_id");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [session, setSession] = useState(null);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return;

            try {
                const res = await fetch(
                    `/api/checkout_session?session_id=${session_id}`
                );
                const sessionData = await res.json();
                if (res.ok) {
                    setSession(sessionData);
                } else {
                    setError(sessionData.error);
                }
            } catch (err) {
                setError("An error occurred while fetching the session");
            } finally {
                setLoading(false);
            }
        }
        fetchCheckoutSession();
    }, [session_id]);

    if (loading) {
        return (
            <Container
                maxWidth="sm"
                sx={{
                    textAlign: "center",
                    mt: 4
                }}
            >
                <CircularProgress />
                <Typography variant="h6">Loading...</Typography>
            </Container>
        )
    }
    if (error) {
        return (
            <Container
                maxWidth="sm"
                sx={{
                    textAlign: "center",
                    mt: 4
                }}
            >
                <Typography variant="h6">{error}</Typography>
            </Container>
        )
    }
    return (
        <Container
            maxWidth="100vw"
            sx={{
                textAlign: "center",
                mt: 4
            }}
        >
            {session.payment_status === "paid" ? (
                <>
                    <Typography variant="h4">Payment successful!</Typography>
                    <Typography variant="body1">Thank you for your purchase</Typography>
                    <Box mt={2}>
                        <Typography variant="h6">Session ID: {session_id}</Typography>
                        <Typography variant="body1">
                            We have sent you an email with the details of your purchase.
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                <Typography variant="h4">Payment failed!</Typography>
                    
                    <Box mt={2}>
                        <Typography variant="h6">Session ID: {session_id}</Typography>
                        <Typography variant="body1">
                            Your payment was not successful. Please try again.
                        </Typography>
                    </Box>
                </>
            )}
        </Container>
    )
};

export default ResultPage