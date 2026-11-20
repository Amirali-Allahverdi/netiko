'use client';

import { useEffect } from 'react';

type AppErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function AppError({ error, retry }: AppErrorProps) {
  useEffect(() => {
    // Connect this point to Sentry/your telemetry provider when one is selected.
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  return (
    <main
      role="alert"
      style={{
        minHeight: '50vh',
        maxWidth: 640,
        margin: '0 auto',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <h2>Something went wrong</h2>
      <p>An unexpected error occurred. Please try again.</p>
      <button type="button" onClick={retry}>
        Try again
      </button>
    </main>
  );
}
