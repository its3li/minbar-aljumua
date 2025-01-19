import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MessageForm from './components/MessageForm';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <Header />
        <Routes>
          <Route path="/" element={<MessageForm />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;