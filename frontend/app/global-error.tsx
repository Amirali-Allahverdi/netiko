'use client';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <main
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 24,
            textAlign: 'center',
          }}
        >
          <h1>Application error</h1>
          <p>The application could not render this page.</p>
          <button type="button" onClick={retry}>
            Try again
          </button>
          {process.env.NODE_ENV === 'development' ? (
            <pre style={{ maxWidth: '100%', overflow: 'auto' }}>{error.message}</pre>
          ) : null}
        </main>
      </body>
    </html>
  );
}
