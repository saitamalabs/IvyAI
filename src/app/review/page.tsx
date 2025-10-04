"use client";

import { useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import PRReviewer from '@/components/PRReviewer';
import { Loader2 } from 'lucide-react';

function ReviewPageContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const pr = searchParams.get('pr');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!owner || !repo || !pr) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600">Missing required parameters (owner, repo, pr)</p>
        </div>
      </div>
    );
  }

  return <PRReviewer owner={owner} repo={repo} prNumber={parseInt(pr, 10)} />;
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <ReviewPageContent />
    </Suspense>
  );
}