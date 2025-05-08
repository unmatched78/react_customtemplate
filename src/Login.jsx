// src/Login.jsx
import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  // src/Login.jsx
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    console.log('[Login] form submit', { username, password: '••••' });
    try {
      await login(username, password);
      console.log('[Login] login() succeeded, navigating to /dashboard');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid credentials';
      console.error('[Login] login() threw', msg);
      setError(msg);
    }
  };


  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Sign In</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" placeholder="Username"
          value={username} onChange={e => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
