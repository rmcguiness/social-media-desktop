import { PageTitle, Card, EditProfileForm } from "@/components";
import { User, Bell, Shield, Palette, LogOut, LogIn } from "lucide-react";
import { getAuthToken } from "@/app/actions/auth";
import { usersService } from "@/services/users.service";
import { SettingsContent } from "./_components/settings-content";
import Link from "next/link";

export default async function Settings() {
    const token = await getAuthToken();
    let isAuthenticated = !!token;
    
    let user = null;
    if (isAuthenticated && token) {
        try {
            const response = await usersService.me(token);
            user = response.user;
        } catch (err) {
            // Token is invalid/expired - treat as unauthenticated
            console.error('Invalid token, treating as unauthenticated:', err);
            isAuthenticated = false;
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex gap-6 px-3 md:px-6 py-4">
                {/* Main Content */}
                <div className="flex-1 max-w-4xl">
                    {/* Header */}
                    <div className="mb-6">
                        <PageTitle title="Settings" />
                    </div>

                    {!isAuthenticated && (
                        <Card className="p-6 mb-6 border-accent/50 bg-accent/5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <LogIn size={24} className="text-accent" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">Sign in for full access</h3>
                                    <p className="text-sm text-foreground-muted mb-4">
                                        Create an account or log in to edit your profile, manage notifications, and access privacy settings.
                                    </p>
                                    <div className="flex gap-3">
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 text-sm font-medium border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="px-4 py-2 text-sm font-semibold bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    <SettingsContent user={user} token={token} isAuthenticated={isAuthenticated} />
                </div>
            </div>
        </div>
    );
}
