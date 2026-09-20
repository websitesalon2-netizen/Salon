import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Loader2, X, KeyRound, AlertCircle } from 'lucide-react';
import { loginManager } from '../lib/api';

interface ManagerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const ManagerLoginModal: React.FC<ManagerLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginManager(password);
      setPassword('');
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify the manager password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-stone-200 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-manager-login"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#233A30] text-amber-200 flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Manager Access Desk
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Authorized salon personnel only. Enter credentials to manage live bookings, queue, barbers, and salon settings.
          </p>
        </div>

        {/* Default Credential Helper Note */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Default Manager Password:</span>
          </div>
          <button
            type="button"
            onClick={() => setPassword('kashmir2026')}
            className="px-2 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-950 rounded font-mono font-bold text-[11px] transition cursor-pointer"
          >
            kashmir2026 (Fill)
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Manager Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                id="input-manager-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#233A30] bg-stone-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="btn-submit-manager-login"
            disabled={loading || !password}
            className="w-full py-3 px-4 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-xs font-semibold tracking-wider uppercase transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-amber-300" />
                <span>Enter Manager Dashboard</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
