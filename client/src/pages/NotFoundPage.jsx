import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <p className="font-mono text-6xl font-bold text-primary mb-4">404</p>
        <h1 className="font-serif text-3xl text-text-primary mb-3">Page Not Found</h1>
        <p className="text-text-secondary text-sm mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
