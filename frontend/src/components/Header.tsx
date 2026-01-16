'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';

export default function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-slate-800">TaskFlow</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
            Home
          </Link>
          <Link href="/#features" className="text-slate-600 hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="/#about" className="text-slate-600 hover:text-slate-900 transition-colors">
            About
          </Link>
          <Link href="/#contact" className="text-slate-600 hover:text-slate-900 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {!isPending && session ? (
            <Link href="/dashboard">
              <Button variant="outline" className="text-sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="text-sm bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}