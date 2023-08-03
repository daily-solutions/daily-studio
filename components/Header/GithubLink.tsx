import React from 'react';
import Link from 'next/link';
import { config } from '@/config';
import { Icons } from '@/ui/Icons';

export function GithubLink() {
  return (
    <Link
      href={config.githubLink}
      target="_blank"
      rel="noreferrer"
      className="hover:bg-accent inline-flex h-10 w-10 items-center justify-center rounded-md"
    >
      <Icons.gitHub className="h-5 w-5" />
      <span className="sr-only">GitHub</span>
    </Link>
  );
}
