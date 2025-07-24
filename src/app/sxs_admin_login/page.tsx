'use client'; // This is a client component

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

declare const __app_id: string | undefined;

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);



    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/profile/data`);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists() && userDocSnap.data()?.role === 'admin') {
                window.location.href = '/sxs_admin';
            } else {
                // If the user is not an admin, log them out and show an error
                await auth.signOut();
                setError('Access Denied: You are not authorized to access the admin panel.');
            }
        } catch (err: unknown) {
            console.error("Login error:", err);
            // Handle Firebase authentication errors with type checking
            if (typeof err === 'object' && err !== null && 'code' in err) {
                const firebaseError = err as { code: string; message: string };
                if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
                    setError('Invalid email or password.');
                } else if (firebaseError.code === 'auth/invalid-email') {
                    setError('Please enter a valid email address.');
                } else {
                    setError('Login failed. Please try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                }
                `}
            </style>
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your admin email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your admin password"
                        />
                    </div>
                    {error && (
                        <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
