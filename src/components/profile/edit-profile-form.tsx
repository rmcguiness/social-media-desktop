'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user-type';
import { usersService } from '@/services/users.service';
import { Check, X, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/forms/image-upload';

interface EditProfileFormProps {
    user: User;
    token: string;
}

export function EditProfileForm({ user, token }: EditProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    // Form state
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio || '');
    const [image, setImage] = useState(user.image || '');
    const [coverImage, setCoverImage] = useState(user.coverImage || '');
    
    // Username validation
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);

    // Debounced username check
    useEffect(() => {
        if (username === user.username) {
            setUsernameAvailable(null);
            return;
        }

        if (username.length < 3) {
            setUsernameAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setCheckingUsername(true);
            try {
                const result = await usersService.checkUsername(username);
                setUsernameAvailable(result.available);
            } catch (err) {
                console.error('Error checking username:', err);
            } finally {
                setCheckingUsername(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username, user.username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (usernameAvailable === false) {
            setError('Username is already taken');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await usersService.updateProfile({
                name: name !== user.name ? name : undefined,
                username: username !== user.username ? username : undefined,
                bio: bio !== (user.bio || '') ? bio : undefined,
                image: image !== (user.image || '') ? (image || null) : undefined,
                coverImage: coverImage !== (user.coverImage || '') ? (coverImage || null) : undefined,
            }, token);
            
            setSuccess(true);
            router.refresh();
            
            // Hide success message after 2 seconds
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <ImageUpload
                label="Profile Picture"
                currentImage={image || user.image}
                onUpload={(url) => setImage(url)}
                type="avatar"
                maxSizeMB={5}
            />

            {/* Cover Image Upload */}
            <ImageUpload
                label="Cover Photo"
                currentImage={coverImage || user.coverImage}
                onUpload={(url) => setCoverImage(url)}
                type="cover"
                maxSizeMB={10}
            />

            {/* Display Name */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                    Display Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="input-field w-full"
                    required
                    minLength={1}
                    maxLength={100}
                />
            </div>

            {/* Username */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                    Username
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-medium pointer-events-none z-10">@</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="username"
                        className="input-field w-full pl-9"
                        required
                        minLength={3}
                        maxLength={32}
                    />
                    {checkingUsername && (
                        <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted animate-spin" />
                    )}
                    {!checkingUsername && usernameAvailable === true && (
                        <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                    {!checkingUsername && usernameAvailable === false && (
                        <X size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                    )}
                </div>
                {usernameAvailable === false && (
                    <p className="text-xs text-red-500">Username is already taken</p>
                )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                    Bio
                </label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="input-field w-full resize-none"
                    maxLength={500}
                />
                <p className="text-xs text-foreground-muted text-right">{bio.length}/500</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm flex items-center gap-2">
                    <Check size={16} />
                    Profile updated successfully!
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading || usernameAvailable === false}
                className="w-full py-3 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                    </>
                ) : (
                    'Save Changes'
                )}
            </button>
        </form>
    );
}
