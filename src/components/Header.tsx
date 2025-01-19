import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Settings, LogOut } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname === '/admin';
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  if (location.pathname === '/login') return null;

  return (
    <header className="p-4 border-b border-[hsl(var(--muted))] islamic-pattern">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          منبر الجمعة
        </Link>
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-[hsl(var(--muted-foreground))] transition-colors"
              >
                تسجيل خروج
                <LogOut className="h-5 w-5" />
              </button>
              {!isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 hover:text-[hsl(var(--muted-foreground))] transition-colors"
                >
                  لوحة التحكم
                  <Settings className="h-5 w-5" />
                </Link>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 hover:text-[hsl(var(--muted-foreground))] transition-colors"
            >
              لوحة التحكم
              <Settings className="h-5 w-5" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}