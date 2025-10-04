"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setAccessToken } = useAuth();
  const hasProcessed = useRef(false);
  const [status, setStatus] = useState('Completing authentication...');

  useEffect(() => {
    // Prevent double execution
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    console.log('[Auth Success] Starting authentication completion');
    console.log('[Auth Success] Has token:', !!token);
    console.log('[Auth Success] Has user data:', !!userStr);

    if (token && userStr) {
      try {
        setStatus('Processing user data...');
        const user = JSON.parse(decodeURIComponent(userStr));
        console.log('[Auth Success] User authenticated:', user.login);
        
        setStatus('Saving authentication...');
        // Set auth state (this will save to localStorage)
        setAccessToken(token);
        setUser(user);
        
        console.log('[Auth Success] Auth state saved, redirecting to dashboard...');
        setStatus('Redirecting to dashboard...');
        
        // Use window.location for more reliable redirect
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      } catch (error) {
        console.error('[Auth Success] Error parsing user data:', error);
        setStatus('Error occurred, redirecting...');
        setTimeout(() => {
          window.location.href = '/?error=invalid_data';
        }, 1000);
      }
    } else {
      console.error('[Auth Success] Missing token or user data');
      setStatus('Missing credentials, redirecting...');
      setTimeout(() => {
        window.location.href = '/?error=missing_credentials';
      }, 1000);
    }
  }, [searchParams, setUser, setAccessToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">{status}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Please wait...</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}