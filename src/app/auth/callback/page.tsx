"use client";

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { githubAPI } from '@/services/githubAPI';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setAccessToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const exchangeCodeForToken = useCallback(async (code: string) => {
    try {
      // Exchange code for access token via our API route
      const response = await fetch('/api/auth/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      const accessToken = data.access_token;

      // Set token in GitHub API service
      githubAPI.setToken(accessToken);

      // Fetch user data
      const userData = await githubAPI.getUser();

      // Set auth in context
      setAccessToken(accessToken);
      setUser(userData);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
      setError('Failed to complete authentication. Please try again.');
      setTimeout(() => router.push('/'), 3000);
    }
  }, [router, setAccessToken, setUser]);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('GitHub authentication failed. Please try again.');
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    if (code) {
      exchangeCodeForToken(code);
    } else {
      setError('No authorization code received.');
      setTimeout(() => router.push('/'), 3000);
    }
  }, [searchParams, router, exchangeCodeForToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        {error ? (
          <div>
            <div className="text-red-500 text-center mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold mb-2">Authentication Failed</h2>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Redirecting to home page...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Authenticating...</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we complete your login.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}