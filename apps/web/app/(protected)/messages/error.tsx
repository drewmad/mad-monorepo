'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Unable to load messages.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 focus-visible-ring"
      >
        Retry
      </button>
    </div>
  );
}
