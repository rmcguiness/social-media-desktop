'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Card, EditProfileForm } from "@/components";
import { User as UserIcon, Bell, Shield, Palette, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { clearAuthToken } from '@/app/actions/auth';
import { User } from '@/types/user-type';
import { settingsService, type NotificationPreferences, type PrivacySettings } from '@/services/settings.service';

interface SettingsContentProps {
    user: User | null;
    token: string | undefined;
    isAuthenticated: boolean;
}

export function SettingsContent({ user, token, isAuthenticated }: SettingsContentProps) {
    const router = useRouter();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance'>(
        isAuthenticated ? 'profile' : 'appearance'
    );
    const [mounted, setMounted] = useState(false);
    const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
        likes: true,
        comments: true,
        follows: true,
        messages: true,
    });
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
        accountVisibility: 'public',
        allowDirectMessages: 'everyone',
    });
    const [loadingSettings, setLoadingSettings] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Load settings on mount
    useEffect(() => {
        if (isAuthenticated && token) {
            loadSettings();
        }
    }, [isAuthenticated, token]);

    const loadSettings = async () => {
        if (!token) return;
        
        setLoadingSettings(true);
        try {
            const settings = await settingsService.get(token);
            if (settings.notificationPreferences) {
                setNotificationPrefs(settings.notificationPreferences);
            }
            if (settings.privacySettings) {
                setPrivacySettings(settings.privacySettings);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoadingSettings(false);
        }
    };

    const updateNotificationPref = async (key: keyof NotificationPreferences, value: boolean) => {
        if (!token) return;

        // Optimistic update
        const oldPrefs = { ...notificationPrefs };
        setNotificationPrefs({ ...notificationPrefs, [key]: value });

        setSavingSettings(true);
        try {
            await settingsService.update({
                notificationPreferences: { [key]: value },
            }, token);
        } catch (error) {
            console.error('Failed to update notification preference:', error);
            // Rollback on error
            setNotificationPrefs(oldPrefs);
        } finally {
            setSavingSettings(false);
        }
    };

    const updatePrivacySetting = async <K extends keyof PrivacySettings>(
        key: K,
        value: PrivacySettings[K]
    ) => {
        if (!token) return;

        // Optimistic update
        const oldSettings = { ...privacySettings };
        setPrivacySettings({ ...privacySettings, [key]: value });

        setSavingSettings(true);
        try {
            await settingsService.update({
                privacySettings: { [key]: value },
            }, token);
        } catch (error) {
            console.error('Failed to update privacy setting:', error);
            // Rollback on error
            setPrivacySettings(oldSettings);
        } finally {
            setSavingSettings(false);
        }
    };

    const handleLogout = async () => {
        await clearAuthToken();
        router.push('/login');
        router.refresh();
    };

    const allTabs = [
        { id: 'profile' as const, label: 'Profile', icon: UserIcon, requiresAuth: true },
        { id: 'notifications' as const, label: 'Notifications', icon: Bell, requiresAuth: true },
        { id: 'privacy' as const, label: 'Privacy', icon: Shield, requiresAuth: true },
        { id: 'appearance' as const, label: 'Appearance', icon: Palette, requiresAuth: false },
    ];

    const tabs = allTabs.filter(tab => !tab.requiresAuth || isAuthenticated);

    const themeOptions = [
        { id: 'light' as const, label: 'Light', icon: Sun },
        { id: 'dark' as const, label: 'Dark', icon: Moon },
        { id: 'system' as const, label: 'System', icon: Monitor },
    ];

    return (
        <div className="space-y-4">
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
            {activeTab === 'profile' && isAuthenticated && user && token && (
                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
                        <EditProfileForm user={user} token={token} />
                    </div>
                </Card>
            )}

            {activeTab === 'notifications' && isAuthenticated && (
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Notification Preferences</h2>
                            {savingSettings && (
                                <span className="text-xs text-foreground-muted">Saving...</span>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-border">
                                <div>
                                    <p className="font-medium">Likes</p>
                                    <p className="text-sm text-foreground-muted">
                                        Get notified when someone likes your post
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={notificationPrefs.likes}
                                        onChange={(e) => updateNotificationPref('likes', e.target.checked)}
                                        disabled={loadingSettings || savingSettings}
                                    />
                                    <div className="w-11 h-6 bg-background-secondary rounded-full peer peer-checked:bg-accent transition-colors peer-disabled:opacity-50"></div>
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
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={notificationPrefs.comments}
                                        onChange={(e) => updateNotificationPref('comments', e.target.checked)}
                                        disabled={loadingSettings || savingSettings}
                                    />
                                    <div className="w-11 h-6 bg-background-secondary rounded-full peer peer-checked:bg-accent transition-colors peer-disabled:opacity-50"></div>
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-border">
                                <div>
                                    <p className="font-medium">Follows</p>
                                    <p className="text-sm text-foreground-muted">
                                        Get notified when someone follows you
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={notificationPrefs.follows}
                                        onChange={(e) => updateNotificationPref('follows', e.target.checked)}
                                        disabled={loadingSettings || savingSettings}
                                    />
                                    <div className="w-11 h-6 bg-background-secondary rounded-full peer peer-checked:bg-accent transition-colors peer-disabled:opacity-50"></div>
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-border">
                                <div>
                                    <p className="font-medium">Messages</p>
                                    <p className="text-sm text-foreground-muted">
                                        Get notified when you receive a direct message
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={notificationPrefs.messages}
                                        onChange={(e) => updateNotificationPref('messages', e.target.checked)}
                                        disabled={loadingSettings || savingSettings}
                                    />
                                    <div className="w-11 h-6 bg-background-secondary rounded-full peer peer-checked:bg-accent transition-colors peer-disabled:opacity-50"></div>
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {activeTab === 'privacy' && isAuthenticated && (
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Privacy & Security</h2>
                            {savingSettings && (
                                <span className="text-xs text-foreground-muted">Saving...</span>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-border">
                                <div>
                                    <p className="font-medium">Private Account</p>
                                    <p className="text-sm text-foreground-muted">
                                        Only approved followers can see your posts
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={privacySettings.accountVisibility === 'private'}
                                        onChange={(e) => updatePrivacySetting('accountVisibility', e.target.checked ? 'private' : 'public')}
                                        disabled={loadingSettings || savingSettings}
                                    />
                                    <div className="w-11 h-6 bg-background-secondary rounded-full peer peer-checked:bg-accent transition-colors peer-disabled:opacity-50"></div>
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                </label>
                            </div>

                            <div className="py-3 border-b border-border">
                                <p className="font-medium mb-2">Who can send you direct messages?</p>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="allowDirectMessages"
                                            value="everyone"
                                            checked={privacySettings.allowDirectMessages === 'everyone'}
                                            onChange={(e) => updatePrivacySetting('allowDirectMessages', e.target.value as any)}
                                            disabled={loadingSettings || savingSettings}
                                            className="w-4 h-4 text-accent"
                                        />
                                        <span className="text-sm">Everyone</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="allowDirectMessages"
                                            value="following"
                                            checked={privacySettings.allowDirectMessages === 'following'}
                                            onChange={(e) => updatePrivacySetting('allowDirectMessages', e.target.value as any)}
                                            disabled={loadingSettings || savingSettings}
                                            className="w-4 h-4 text-accent"
                                        />
                                        <span className="text-sm">People you follow</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="allowDirectMessages"
                                            value="nobody"
                                            checked={privacySettings.allowDirectMessages === 'nobody'}
                                            onChange={(e) => updatePrivacySetting('allowDirectMessages', e.target.value as any)}
                                            disabled={loadingSettings || savingSettings}
                                            className="w-4 h-4 text-accent"
                                        />
                                        <span className="text-sm">Nobody</span>
                                    </label>
                                </div>
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
                                <div className="grid grid-cols-3 gap-3">
                                    {mounted && themeOptions.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = theme === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => setTheme(option.id)}
                                                className={`
                                                    flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all
                                                    ${isSelected 
                                                        ? 'border-accent bg-accent/5' 
                                                        : 'border-border hover:border-accent/50'
                                                    }
                                                `}
                                            >
                                                <div className={`
                                                    w-full h-16 rounded-lg flex items-center justify-center
                                                    ${option.id === 'light' ? 'bg-white border border-gray-200' : ''}
                                                    ${option.id === 'dark' ? 'bg-gray-900' : ''}
                                                    ${option.id === 'system' ? 'bg-gradient-to-r from-white to-gray-900' : ''}
                                                `}>
                                                    <Icon 
                                                        size={24} 
                                                        className={option.id === 'light' ? 'text-gray-900' : 'text-white'} 
                                                    />
                                                </div>
                                                <p className="text-sm font-medium">{option.label}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {mounted && (
                                <p className="text-xs text-foreground-muted pt-2">
                                    Current theme: {theme === 'system' ? `System (${resolvedTheme})` : theme}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* Logout Button - Only show when authenticated */}
            {isAuthenticated && (
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
            )}
        </div>
    );
}
