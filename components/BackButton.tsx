'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mt-8 inline-flex cursor-pointer items-center text-[var(--link-primary)] hover:underline"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="stroke-current"
      >
        <path
          d="M10 12L6 8L10 4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Back</span>
    </button>
  );
}
