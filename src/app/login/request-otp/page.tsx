'use client';
import type { Metadata } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserApiRepository } from '@/infrastructure/frontend/repositories/UserRepositoy.api';
import { Input } from '@/components/ui/input';



export default function RequestOtpPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const userRepository = new UserApiRepository();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with email:', email);
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const result = await userRepository.requestOtp(email);
      console.log('OTP request result:', result);
      setMessage('OTP sent successfully, check your email');
      const url = `/login/verifyOtp?email=${encodeURIComponent(email)}`;
      console.log('Navigating to:', url);
      router.push(url);
      console.log('Navigation triggered');
    } catch (error) {
      console.error('Request OTP Error:', error);
      setError('Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Request OTP</h1>
        <p className="text-center text-gray-600 mb-6">Enter your email to receive a One-Time Password.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Sending OTP...' : 'Request OTP'}
          </button>
        </form>
        {message && <p className="text-green-600 text-center mt-4">{message}</p>}
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}