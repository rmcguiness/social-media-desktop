import { Card } from "@/components";
import { usersService } from "@/services/users.service";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { getAuthToken } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
    const token = await getAuthToken();

    // If authenticated, redirect to user's profile page
    if (token) {
        // Get user data - if this fails, just show login prompt
        const meResponse = await usersService.me(token).catch(() => null);
        
        if (meResponse) {
            // redirect() throws by design in Next.js - don't catch it
            redirect(`/profile/${meResponse.user.username}`);
        }
    }

    // Not authenticated - show login prompt
    return (
        <div className="w-full min-h-screen">
            <main className="flex flex-col w-full max-w-4xl mx-auto px-3 md:px-6 py-4">
                <Card className="p-12 text-center space-y-6 mt-20">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                            <LogIn size={40} className="text-accent" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Sign in to view your profile</h2>
                        <p className="text-foreground-muted">
                            Create an account or log in to manage your profile, posts, and settings.
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/login"
                            className="px-6 py-3 text-sm font-medium border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/register"
                            className="px-6 py-3 text-sm font-semibold bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </Card>
            </main>
        </div>
    );
}