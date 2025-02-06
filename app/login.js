// pages/login.js
"use client";

import React, { useState } from 'react';
import { auth, provider, db } from '@/app/lib/firebase';
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';

const LoginRegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyName, setCompanyName] = useState(''); // New company name state
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            toast.success('Logged in with Google successfully!');
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    companyName: '', // You can set this later
                    role: 'operator', // Default role for Google sign-in
                });
            }
            router.push(userDoc.data().role === 'admin' ? '/admin/dashboard' : '/operator/dashboard');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const userDocRef = doc(db, 'users', userCredential.user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    toast.success('Logged in successfully!');
                    router.push(userDoc.data().role === 'admin' ? '/admin/dashboard' : '/operator/dashboard');
                }
            } catch (error) {
                if (error.code === 'auth/user-not-found') {
                    toast.error('No account found with this email. Please register.');
                } else {
                    toast.error(error.message);
                }
            }
        } else {
            if (password !== confirmPassword) {
                toast.error('Passwords do not match!');
                return;
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    email,
                    companyName, // Include company name in user document
                    role: 'operator', // Default role for new users
                });
                toast.success('Registration successful! Check your email for verification.');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setCompanyName(''); // Reset company name field
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col w-80">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="border p-2 mb-2"
                    required
                />
                <div className="relative mb-2">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="border p-2 w-full"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-gray-600"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
                {!isLogin && (
                    <div className="relative mb-2">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="border p-2 w-full"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-2 text-gray-600"
                        >
                            {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                )}
                {!isLogin && (
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company Name"
                        className="border p-2 mb-2"
                        required
                    />
                )}
                <button type="submit" className="bg-blue-500 text-white p-2 mb-2">
                    {isLogin ? 'Login' : 'Register'}
                </button>
                <button type="button" onClick={handleGoogleSignIn} className="bg-red-500 text-white p-2 mb-2">
                    Sign in with Google
                </button>
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 underline"
                >
                    {isLogin ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginRegisterPage;
