import { Toaster } from 'react-hot-toast';
import { AppRouter } from './routes/AppRouter';

export default function App(): React.JSX.Element {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0f172a',
            color: '#ffffff',
            fontSize: '0.875rem',
            borderRadius: '0.75rem',
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </>
  );
}
