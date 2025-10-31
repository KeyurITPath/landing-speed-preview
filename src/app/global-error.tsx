'use client';

import { Box, Container, Typography, Button, Paper, Link } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleGoHome = () => {
    // For global error pages, use window.location to ensure navigation works
    // This bypasses any router issues that might be causing the error
    window.location.href = '/';
  };

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <title>Something Went Wrong | Eduelle</title>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily:
            "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        }}
      >
        <Box
          sx={{
            margin: 0,
            background: '#f8f9ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            color: '#111827',
            textAlign: 'center',
          }}
        >
          <Container maxWidth='sm'>
            <Paper
              elevation={0}
              sx={{
                maxWidth: 600,
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
                padding: { xs: '36px 20px', sm: '48px 32px' },
              }}
            >
              {/* Illustration */}
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    'linear-gradient(135deg, #5B7CFF 0%, #3b5bff 100%)',
                  borderRadius: '50%',
                  position: 'relative',
                  '&::before': {
                    content: '"⚠"',
                    fontSize: '60px',
                    color: 'white',
                    fontWeight: 'bold',
                  },
                }}
              />

              {/* Main Title */}
              <Typography
                variant='h1'
                sx={{
                  fontSize: { xs: '26px', sm: '30px' },
                  marginBottom: '12px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: '#111827',
                }}
              >
                Something Went Wrong
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  color: '#6b7280',
                  marginBottom: '28px',
                  fontSize: '16px',
                  lineHeight: 1.6,
                }}
              >
                We&apos;re sorry, but something didn&apos;t load properly.
                <br />
                Please try again later or return to the homepage.
              </Typography>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  component='a'
                  href='/'
                  onClick={e => {
                    e.preventDefault();
                    handleGoHome();
                  }}
                  sx={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(90deg, #5B7CFF, #3b5bff)',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    textTransform: 'none',
                    '&:hover': {
                      opacity: 0.9,
                      transform: 'translateY(-1px)',
                      background: 'linear-gradient(90deg, #5B7CFF, #3b5bff)',
                    },
                  }}
                >
                  Go to Home
                </Button>
              </Box>

              {/* Support Box */}
              <Box
                sx={{
                  marginTop: '36px',
                  background: 'rgba(91, 124, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  color: '#6b7280',
                }}
              >
                Need help? Contact our support team at{' '}
                <Link
                  href='mailto:hello@eduelle.com'
                  sx={{
                    color: '#5B7CFF',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  hello@eduelle.com
                </Link>
              </Box>

              {/* Footer Note */}
              <Typography
                sx={{
                  marginTop: '16px',
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                &copy; 2025 Eduelle — All Rights Reserved
              </Typography>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && (
                <Box
                  sx={{
                    marginTop: '24px',
                    padding: '16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    textAlign: 'left',
                  }}
                >
                  <Typography
                    variant='subtitle2'
                    sx={{ fontWeight: 600, mb: 1, color: '#dc2626' }}
                  >
                    Error Details (Development):
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: '#7f1d1d',
                    }}
                  >
                    <strong>Error:</strong> {error.name}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: '#7f1d1d',
                    }}
                  >
                    <strong>Message:</strong> {error.message}
                  </Typography>
                  {error.digest && (
                    <Typography
                      variant='body2'
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: '#7f1d1d',
                      }}
                    >
                      <strong>Digest:</strong> {error.digest}
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          </Container>
        </Box>
      </body>
    </html>
  );
}
