'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page since registration is disabled
    router.push('/login');
  }, [router]);

  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-background">
      <div className="text-center">
        <h3 className="text-xl font-semibold dark:text-zinc-50">Registration Disabled</h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
          User registration is not available. Redirecting to login...
        </p>
      </div>
    </div>
  );
}
