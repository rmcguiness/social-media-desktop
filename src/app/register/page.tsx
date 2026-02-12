'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { Card } from '@/components';
import { Mail } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

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
            await authService.register({
                email: formData.email,
                username: formData.username,
                name: formData.name,
                password: formData.password,
            });
            
            // Show success message
            setRegisteredEmail(formData.email);
            setEmailSent(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // Show email sent message after successful registration
    if (emailSent) {
        return (
            <div className="min-h-[var(--screen-minus-navbar)] flex items-center justify-center px-4 py-8 bg-background">
                <Card className="w-full max-w-md shadow-xl">
                    <div className="p-6 md:p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Mail size={48} className="text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-foreground mb-3">
                            Check Your Email
                        </h1>

                        <p className="text-foreground-muted text-lg mb-6">
                            We've sent a verification link to{' '}
                            <span className="font-semibold text-foreground">{registeredEmail}</span>
                        </p>

                        <div className="bg-background rounded-lg p-4 mb-6 text-left">
                            <h2 className="text-sm font-semibold text-foreground mb-2">
                                What to do next:
                            </h2>
                            <ol className="text-sm text-foreground-muted space-y-2 list-decimal list-inside">
                                <li>Check your inbox (and spam folder)</li>
                                <li>Click the verification link in the email</li>
                                <li>The link expires in 15 minutes</li>
                                <li>Log in after verifying your email</li>
                            </ol>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                <strong>Didn't receive the email?</strong> Check your spam folder or wait a few minutes. The link expires in 15 minutes.
                            </p>
                        </div>

                        <Link
                            href="/login"
                            className="block w-full py-3 px-6 bg-background border-2 border-border text-foreground font-semibold rounded-lg hover:bg-background-secondary transition-colors"
                        >
                            Go to Login
                        </Link>

                        <p className="text-xs text-foreground-muted mt-4">
                            Wrong email?{' '}
                            <button
                                onClick={() => setEmailSent(false)}
                                className="text-accent hover:underline"
                            >
                                Try again
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

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
