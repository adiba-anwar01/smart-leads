import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-secondary min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-indigo-600 mb-4">404</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-600 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => navigate('/leads')} variant="primary">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
