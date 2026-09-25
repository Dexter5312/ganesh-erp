import React, { useState } from 'react';

function Login({ onLogin, onForgotPassword, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ganesh-erp.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.message === 'Login successful') {
        onLogin(data.role || 'worker');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 relative border border-gray-200">
        
        {onBack && (
          <button 
            onClick={onBack}
            className="mb-4 text-blue-600 hover:underline text-sm flex items-center"
          >
            &larr; Back to Modules
          </button>
        )}

        <div className="border-b pb-4 mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            System Login
          </h2>
          <p className="text-gray-500 text-sm mt-1">Please enter your credentials to continue</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Password"
              required
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
