import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const AuthModal = ({ onClose }) => {
  const { login, register, signInWithGoogle } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{isRegister ? 'Register' : 'Sign in'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-700 text-white py-2 rounded">
            {isRegister ? 'Create account' : 'Sign in'}
          </button>

          <button type="button" onClick={handleGoogle} disabled={loading} className="w-full bg-white border py-2 rounded flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18"><path fill="#EA4335" d="M24 9.5c3.8 0 6.9 1.3 9.4 3.1l7.1-7.1C36.2 2.5 30.5 0 24 0 14.7 0 6.9 5.3 2.5 12.9l8.6 6.7C12.1 13.3 17.6 9.5 24 9.5z"/><path fill="#34A853" d="M46.5 24c0-1.6-.1-3.1-.4-4.6H24v9h12.7c-.5 2.6-2 5-4.3 6.6l6.7 5.2C44.6 37.6 46.5 31.2 46.5 24z"/><path fill="#4A90E2" d="M9.1 29.6A14.6 14.6 0 0 1 8 24c0-1.6.3-3.2.8-4.6L.1 12.7A24 24 0 0 0 0 24c0 3.9.9 7.6 2.5 10.9l6.6-5.3z"/><path fill="#FBBC05" d="M24 48c6.5 0 12.2-2 16.2-5.5l-7.7-6.1C30.2 36.9 27.2 38 24 38c-6.4 0-11.9-3.7-14.9-9.1l-6.6 5.3C6.9 42.7 14.7 48 24 48z"/></svg>
            Continue with Google
          </button>

          <div className="text-center text-sm text-gray-600">
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-indigo-700 hover:underline">
              {isRegister ? 'Have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
