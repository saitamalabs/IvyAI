"use client";

import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import LandingPage from '@/components/LandingPage';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

function HomeContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorShown, setErrorShown] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error && !errorShown) {
      setErrorShown(true);
      const errorMessages: Record<string, string> = {
        'access_denied': 'GitHub authorization was denied',
        'no_code': 'Authorization code not received',
        'callback_failed': 'Authentication callback failed. Please check your environment variables.',
        'invalid_data': 'Invalid authentication data received',
        'missing_credentials': 'Missing authentication credentials',
        'missing_env_vars': 'GitHub OAuth is not configured. Please add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to your environment variables.',
        'no_token': 'Failed to receive access token from GitHub',
        'user_fetch_failed': 'Failed to fetch user data from GitHub'
      };
      const message = errorMessages[error] || `Authentication failed: ${error}`;
      toast.error(message, {
        description: 'Please try signing in again',
        duration: 5000,
      });
      // Clean up URL
      router.replace('/');
    }
  }, [searchParams, errorShown, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <LandingPage />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}