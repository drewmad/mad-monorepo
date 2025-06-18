'use client';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, Card, Badge } from '@ui';
import { Eye, EyeOff, Check, X, Shield, Mail, User, Lock, ArrowRight } from 'lucide-react';

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
}

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Too weak',
    color: 'bg-red-500'
  });
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { id: 'length', label: 'At least 8 characters', test: (pwd) => pwd.length >= 8, met: false },
    { id: 'uppercase', label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd), met: false },
    { id: 'lowercase', label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd), met: false },
    { id: 'number', label: 'One number', test: (pwd) => /\d/.test(pwd), met: false },
    { id: 'special', label: 'One special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), met: false },
  ]);

  const router = useRouter();
  const supabase = supabaseBrowser();

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: 'Enter password', color: 'bg-gray-300' });
      return;
    }

    const metRequirements = passwordRequirements.filter(req => req.test(password)).length;
    const lengthBonus = password.length >= 12 ? 1 : 0;
    const score = Math.min(metRequirements + lengthBonus, 4);

    let label, color;
    switch (score) {
      case 0:
      case 1:
        label = 'Very weak';
        color = 'bg-red-500';
        break;
      case 2:
        label = 'Weak';
        color = 'bg-orange-500';
        break;
      case 3:
        label = 'Good';
        color = 'bg-yellow-500';
        break;
      case 4:
        label = 'Strong';
        color = 'bg-green-500';
        break;
      default:
        label = 'Very strong';
        color = 'bg-green-600';
    }

    setPasswordStrength({ score, label, color });
  }, [password, passwordRequirements]);

  // Update password requirements
  useEffect(() => {
    setPasswordRequirements(prev =>
      prev.map(req => ({ ...req, met: req.test(password) }))
    );
  }, [password]);

  const isFormValid = () => {
    return name.trim().length >= 2 &&
      email.includes('@') &&
      passwordRequirements.filter(req => req.met).length >= 4;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid()) {
      setError('Please ensure all requirements are met');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data?.user) {
        if (data.user.email_confirmed_at) {
          router.push('/workspace-selection');
        } else {
          setSuccess(true);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign-up error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Check your email
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a confirmation link to <strong className="text-gray-900">{email}</strong>.
            Please check your email and click the link to complete your registration.
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/sign-in')}
              variant="primary"
              className="w-full"
            >
              Back to Sign In
            </Button>
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or contact support.
            </p>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-600">
              Get started with your free account today.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center space-x-2">
                <X className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your full name"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              {name.length > 0 && name.length < 2 && (
                <p className="text-sm text-red-600">Name must be at least 2 characters</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              {email.length > 0 && !email.includes('@') && (
                <p className="text-sm text-red-600">Please enter a valid email address</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Create a password"
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Password strength</span>
                    <Badge
                      variant={passwordStrength.score >= 3 ? 'success' : passwordStrength.score >= 2 ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {passwordStrength.label}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-colors duration-200 ${level <= passwordStrength.score
                          ? passwordStrength.color
                          : 'bg-gray-200'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {password && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Password requirements:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {passwordRequirements.map((requirement) => (
                      <div
                        key={requirement.id}
                        className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${requirement.met ? 'text-green-700' : 'text-gray-500'
                          }`}
                      >
                        {requirement.met ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                        <span>{requirement.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isFormValid()}
              variant={isFormValid() ? 'primary' : 'secondary'}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Create account</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a
                  href="/sign-in"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Security & Privacy</h4>
                <p className="text-sm text-blue-800 mt-1">
                  Your data is encrypted and secure. We never share your information with third parties.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Development helper */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Development Note:</strong> Make sure you have created a `.env.local` file with your Supabase credentials.
              Check <code>ENVIRONMENT_SETUP.md</code> for instructions.
            </p>
          </div>
        )}
      </div>
    </main>
  );
} 