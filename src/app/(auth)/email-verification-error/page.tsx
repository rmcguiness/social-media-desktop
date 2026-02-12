import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';

export default function EmailVerificationErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessage = searchParams.error || 'Email verification failed';
  const isExpired = errorMessage.toLowerCase().includes('expired');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Error icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle size={48} className="text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {isExpired ? 'Link Expired' : 'Verification Failed'}
          </h1>

          {/* Error message */}
          <p className="text-foreground-muted text-lg mb-8">
            {errorMessage}
          </p>

          {/* Info box */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-left">
            <h2 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
              What happened?
            </h2>
            <p className="text-sm text-red-700 dark:text-red-300">
              {isExpired
                ? 'Verification links expire after 15 minutes for security. Please sign up again to receive a new verification email.'
                : 'The verification link may be invalid or already used. If you already verified your email, try logging in.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {isExpired ? (
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                <RefreshCw size={18} />
                Sign Up Again
              </Link>
            ) : (
              <Link
                href="/login"
                className="block w-full py-3 px-6 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Try Logging In
              </Link>
            )}

            <Link
              href="/"
              className="block w-full py-3 px-6 bg-background border-2 border-border text-foreground font-semibold rounded-lg hover:bg-background-secondary transition-colors"
            >
              Go to Home
            </Link>
          </div>

          {/* Help text */}
          <p className="text-xs text-foreground-muted mt-6">
            Need help? Contact{' '}
            <a href="mailto:support@socialmediaapp.com" className="text-accent hover:underline">
              support@socialmediaapp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
