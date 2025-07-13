import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Kailyan Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Welcome to your admin panel
        </p>
        <Link 
          href="/admin"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}