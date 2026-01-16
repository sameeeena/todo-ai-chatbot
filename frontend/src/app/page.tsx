'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSession } from '@/lib/auth-client';

export default function LandingPage() {
  const { data: session, isPending } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <Header />

      <main className="flex-grow container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Streamline Your Tasks, Amplify Your <span className="text-blue-600">Productivity</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              TaskFlow is the elegant solution to manage your daily tasks efficiently. Focus on what matters most with our intuitive and beautiful interface.
            </p>

            {!isPending && !session && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login-dashboard">
                  <Button className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl">
                    Get Started
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="px-8 py-6 text-lg rounded-xl">
                    Learn More
                  </Button>
                </Link>
              </div>
            )}

            {session && (
              <div className="flex justify-center">
                <Link href="/dashboard">
                  <Button className="px-8 py-6 text-lg bg-green-600 hover:bg-green-700 rounded-xl">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to stay organized and boost your productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Smart Organization</CardTitle>
                <CardDescription className="text-slate-600">
                  Intuitive categorization and tagging system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Organize your tasks with customizable categories and smart tags to find what you need instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Real-time Sync</CardTitle>
                <CardDescription className="text-slate-600">
                  Access your tasks anywhere, anytime
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Stay in sync across all your devices with real-time updates and seamless experience.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Focus Mode</CardTitle>
                <CardDescription className="text-slate-600">
                  Distraction-free environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Minimize distractions with our focus mode that helps you concentrate on your tasks.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        {!isPending && !session && (
          <section className="py-16 text-center">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold">Ready to Transform Your Productivity?</CardTitle>
                <CardDescription className="text-blue-100">
                  Join thousands of users who have revolutionized their task management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/register">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-xl">
                    Start Free Trial
                  </Button>
                </Link>
                <p className="mt-4 text-blue-100 text-sm">
                  No credit card required • 14-day free trial
                </p>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}