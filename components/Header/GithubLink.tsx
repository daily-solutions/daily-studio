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
      className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
    >
      <Icons.gitHub className="h-5 w-5" />
      <span className="sr-only">GitHub</span>
    </Link>
  );
}
