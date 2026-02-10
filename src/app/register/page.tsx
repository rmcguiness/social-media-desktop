'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { setAuthToken } from '@/app/actions/auth';
import { Card } from '@/components';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register({
                email: formData.email,
                username: formData.username,
                name: formData.name,
                password: formData.password,
            });
            
            // Store token in cookie via server action
            await setAuthToken(response.token);

            // Redirect to home
            router.push('/home');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[var(--screen-minus-navbar)] flex items-center justify-center px-4 py-8 bg-background">
            <Card className="w-full max-w-md shadow-xl">
                <div className="p-6 md:p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent mb-2">
                            Create Account
                        </h1>
                        <p className="text-foreground-muted text-sm">
                            Join our community today
                        </p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="input-field w-full"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-semibold text-foreground">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="input-field w-full"
                                placeholder="johndoe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-field w-full"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                className="input-field w-full"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-foreground-muted">Minimum 8 characters</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={8}
                                className="input-field w-full"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-foreground-muted">
                            Already have an account?{' '}
                            <Link href="/login" className="text-accent font-semibold hover:text-accent-hover hover:underline transition-colors">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
