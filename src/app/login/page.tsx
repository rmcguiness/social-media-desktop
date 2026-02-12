'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components';

export default function LoginPage() {
    const router = useRouter();
    const login = useAuth((state) => state.login);
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Use the auth store's login method (updates state + stores tokens)
            await login(emailOrUsername, password);

            // Redirect to home
            router.push('/home');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[var(--screen-minus-navbar)] flex items-center justify-center px-4 py-8 bg-background">
            <Card className="w-full max-w-md shadow-xl">
                <div className="p-6 md:p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-foreground-muted text-sm">
                            Sign in to continue to your account
                        </p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="emailOrUsername" className="block text-sm font-semibold text-foreground">
                                Email or Username
                            </label>
                            <input
                                id="emailOrUsername"
                                type="text"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                required
                                className="input-field w-full"
                                placeholder="you@example.com or username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field w-full"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-foreground-muted">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-accent font-semibold hover:text-accent-hover hover:underline transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
