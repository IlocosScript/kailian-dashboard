import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Tourism Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Manage your tourism content with our comprehensive admin interface
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/admin">
            <Button size="lg" className="px-8">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}