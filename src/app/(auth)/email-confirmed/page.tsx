import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function EmailConfirmedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-foreground mb-3">
            You're all set!
          </h1>

          {/* Description */}
          <p className="text-foreground-muted text-lg mb-8">
            Your email has been verified successfully. You can now log in and start using your account.
          </p>

          {/* What's next section */}
          <div className="bg-background rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              What's next?
            </h2>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>Complete your profile with a photo and bio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>Find and follow interesting people</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>Share your first post</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>Join conversations and connect with others</span>
              </li>
            </ul>
          </div>

          {/* Login button */}
          <Link
            href="/login"
            className="block w-full py-3 px-6 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Log In Now
          </Link>

          {/* Help text */}
          <p className="text-xs text-foreground-muted mt-6">
            Having trouble? Contact{' '}
            <a href="mailto:support@socialmediaapp.com" className="text-accent hover:underline">
              support@socialmediaapp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
