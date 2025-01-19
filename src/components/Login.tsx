import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a simple example - in production, use proper authentication
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] flex items-center justify-center">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold">تسجيل الدخول</h2>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">
            الرجاء إدخال كلمة المرور للوصول إلى لوحة التحكم
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[hsl(var(--muted))] border border-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--foreground))] transition-shadow text-center"
              placeholder="كلمة المرور"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-4 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] rounded-2xl font-bold text-lg hover:opacity-90 transition-all duration-300 islamic-pattern"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}