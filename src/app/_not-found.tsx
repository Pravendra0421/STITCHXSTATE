import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition-colors duration-200">Go Home</Link>
    </div>
  );
} 