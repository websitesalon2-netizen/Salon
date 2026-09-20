import React, { useState } from 'react';
import { Terminal, Lock, Eye, EyeOff, Loader2, X, KeyRound, AlertCircle, Code2 } from 'lucide-react';
import { verifyDeveloperPasscode } from '../lib/api';

interface DeveloperLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const DeveloperLoginModal: React.FC<DeveloperLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const ok = await verifyDeveloperPasscode(passcode);
      if (ok) {
        setPasscode('');
        onLoginSuccess();
      } else {
        setError('Invalid developer passcode. Use default key: dev2026');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check passcode.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBypass = () => {
    setPasscode('dev2026');
    setLoading(true);
    verifyDeveloperPasscode('dev2026').then((ok) => {
      setLoading(false);
      if (ok) onLoginSuccess();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-stone-900 border border-stone-700 p-6 sm:p-8 shadow-2xl space-y-6 text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-developer-login"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <Terminal className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/40 border border-emerald-600/30 text-emerald-300 text-[11px] font-mono font-medium">
            <Code2 className="w-3 h-3" />
            <span>Developer Desk Console</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
            Developer Authentication
          </h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            Full site customization desk: modify text, pictures, addresses, name, logo, favicon, map coordinates & raw JSON.
          </p>
        </div>

        {/* Default Credential Helper Note */}
        <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 text-stone-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Developer Key:</span>
            <code className="font-mono bg-stone-950 px-1.5 py-0.5 rounded text-emerald-300 font-bold border border-emerald-900">
              dev2026
            </code>
          </div>
          <button
            type="button"
            onClick={handleQuickBypass}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            Auto-Fill
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>Developer Security Passcode</span>
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter dev2026 or developer key"
                required
                id="input-developer-passcode"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="btn-submit-developer-login"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                <span>Enter Developer Desk</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-[11px] text-stone-500 font-mono">
            Developed by Shujaat · Pampore, Kashmir
          </p>
        </div>

      </div>
    </div>
  );
};
