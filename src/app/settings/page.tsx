'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle, Card } from "@/components";
import { User, Bell, Shield, Palette, LogOut } from "lucide-react";
import { clearAuthToken } from '@/app/actions/auth';

export default function Settings() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance'>('profile');

    const handleLogout = async () => {
        await clearAuthToken();
        router.push('/login');
        router.refresh();
    };

    const tabs = [
        { id: 'profile' as const, label: 'Profile', icon: User },
        { id: 'notifications' as const, label: 'Notifications', icon: Bell },
        { id: 'privacy' as const, label: 'Privacy', icon: Shield },
        { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex gap-6 px-3 md:px-6 py-4">
                {/* Main Content */}
                <div className="flex-1 max-w-4xl">
                    {/* Header */}
                    <div className="mb-6">
                        <PageTitle title="Settings" />
                    </div>

                    {/* Tabs Navigation */}
                    <Card className="mb-6">
                        <div className="flex flex-wrap gap-2 p-4">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                                            ${activeTab === tab.id
                                                ? 'bg-accent text-white shadow-sm'
                                                : 'bg-background text-foreground hover:bg-opacity-50'
                                            }
                                        `}
                                    >
                                        <Icon size={18} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Settings Content */}
                    <div className="space-y-4">
                        {activeTab === 'profile' && (
                            <Card>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-foreground">
                                                Display Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Your name"
                                                className="input-field w-full"
                                                disabled
                                            />
                                            <p className="text-xs text-foreground-muted">
                                                Profile editing coming soon
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-foreground">
                                                Bio
                                            </label>
                                            <textarea
                                                placeholder="Tell us about yourself..."
                                                rows={3}
                                                className="input-field w-full resize-none"
                                                disabled
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-foreground">
                                                Profile Picture URL
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://example.com/avatar.jpg"
                                                className="input-field w-full"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-border">
                                            <div>
                                                <p className="font-medium">Likes</p>
                                                <p className="text-sm text-foreground-muted">
                                                    Get notified when someone likes your post
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                                                <div className="w-11 h-6 bg-background-secondary rounded-full peer peer-checked:bg-accent transition-colors"></div>
                                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b border-border">
                                            <div>
                                                <p className="font-medium">Comments</p>
                                                <p className="text-sm text-foreground-muted">
                                                    Get notified when someone comments on your post
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                                                <div className="w-11 h-6 bg-background-secondary rounded-full peer peer-checked:bg-accent transition-colors"></div>
                                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                            </label>
                                        </div>

                                        <p className="text-xs text-foreground-muted pt-2">
                                            Notification preferences coming soon
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'privacy' && (
                            <Card>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold mb-4">Privacy & Security</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-border">
                                            <div>
                                                <p className="font-medium">Private Account</p>
                                                <p className="text-sm text-foreground-muted">
                                                    Only approved followers can see your posts
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" disabled />
                                                <div className="w-11 h-6 bg-background-secondary rounded-full peer peer-checked:bg-accent transition-colors"></div>
                                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                            </label>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-background transition-colors">
                                                <p className="font-medium">Blocked Users</p>
                                                <p className="text-sm text-foreground-muted">Manage blocked accounts</p>
                                            </button>

                                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-background transition-colors">
                                                <p className="font-medium">Change Password</p>
                                                <p className="text-sm text-foreground-muted">Update your password</p>
                                            </button>
                                        </div>

                                        <p className="text-xs text-foreground-muted pt-2">
                                            Privacy settings coming soon
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'appearance' && (
                            <Card>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold mb-4">Appearance</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-medium mb-3">Theme</p>
                                            <div className="flex gap-3">
                                                <button className="flex-1 p-4 rounded-lg border-2 border-border hover:border-accent transition-colors">
                                                    <div className="w-full h-20 bg-white rounded mb-2"></div>
                                                    <p className="text-sm font-medium text-center">Light</p>
                                                </button>
                                                <button className="flex-1 p-4 rounded-lg border-2 border-accent bg-accent/5">
                                                    <div className="w-full h-20 bg-gray-900 rounded mb-2"></div>
                                                    <p className="text-sm font-medium text-center">Dark</p>
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-xs text-foreground-muted pt-2">
                                            Theme is controlled by your system preferences. Manual theme switching coming soon.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Logout Button */}
                        <Card className="border-red-500/20">
                            <button
                                onClick={handleLogout}
                                className="w-full p-6 flex items-center justify-between hover:bg-red-500/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <LogOut size={20} className="text-red-500" />
                                    <div className="text-left">
                                        <p className="font-semibold text-red-500">Log Out</p>
                                        <p className="text-sm text-foreground-muted">Sign out of your account</p>
                                    </div>
                                </div>
                            </button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
