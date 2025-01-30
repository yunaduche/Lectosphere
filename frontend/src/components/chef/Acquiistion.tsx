import React, { useState } from 'react';

const AdvancedSessionsManager: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //signup logique
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block font-medium mb-2">
            User Name
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md w-full"
        >
          Sign Up
        </button>

        <div className="mt-4 text-center">
          <p>Or signup with:</p>
          <div className="flex justify-center mt-2">
            <button className="bg-gray-200 hover:bg-gray-300 rounded-md px-4 py-2 mr-2">
              <img src="/google.svg" alt="Google" className="h-6 w-6" />
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 rounded-md px-4 py-2 mr-2">
              <img src="/apple.svg" alt="Apple" className="h-6 w-6" />
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 rounded-md px-4 py-2">
              <img src="/facebook.svg" alt="Facebook" className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{' '}
            <a href="#" className="text-green-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSessionsManager;