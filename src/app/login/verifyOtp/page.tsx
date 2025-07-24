'use client'; 
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserApiRepository } from '@/infrastructure/frontend/repositories/UserRepositoy.api';
import { useAuthStore } from '../../../store/authStore';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

function VerifyOtpPageContent(){
    const router = useRouter();
    const searchParams= useSearchParams();
    const initialEmail =searchParams.get('email');
    const verifyApi = new UserApiRepository();
    const [email,setEmail]=useState(initialEmail);
    const [otp,setOtp] = useState('');
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState('');

    const {login:zustandLogin}=useAuthStore();
    useEffect(()=>{
        if(!initialEmail){
            setError('NO Email provided  for otp verification please request a new otp ');
            //we can  add Redirect back after a short delay
             // const timer = setTimeout(() => router.push('/request-otp'), 3000);
             // return () => clearTimeout(timer);  
        }
    },[initialEmail,router]);
     const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Email is missing. Please go back and request OTP.');
      setLoading(false);
      return;
    }
    try {
        const response = await verifyApi.verifyOtpAndLogin(email,otp);
        console.log('verification Response ',response);
        Cookies.set('session', response.token, { expires: 1, path: '/' });
        zustandLogin(response.user);
        router.push('/');
    } catch (err:any) {
        console.error('Verify OTP Error:', err);
        setError(err.message || 'Failed to verify OTP. Please check your OTP and try again.');
    }finally{
        setLoading(false);
    }
}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Verify OTP</h1>
        {email ? (
          <p className="text-center text-gray-600 mb-6">
            An OTP has been sent to <span className="font-semibold">{email}</span>. Please enter it below:
          </p>
        ) : (
          <p className="text-center text-red-600 mb-6">
            No email provided. Please go back to the <a href="/login/request-otp" className="text-blue-600 hover:underline">Request OTP</a> page.
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
          <InputOTP 
          maxLength={6} 
          className='text-center'
          value={otp}
          onChange={(value)=>setOtp(value)}
          disabled={loading || !email}
          >
            <InputOTPGroup>
            <InputOTPSlot index={0}/>
            <InputOTPSlot index={1}/>
            <InputOTPSlot index={2}/>
            <InputOTPSlot index={3}/>
            <InputOTPSlot index={4}/>
            <InputOTPSlot index={5}/>
            </InputOTPGroup>
          </InputOTP>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full p-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpPageContent />
    </Suspense>
  );
}