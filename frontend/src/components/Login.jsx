import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apis';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { access } = await loginUser({ username, password });
      login(access);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 shadow rounded bg-white"
      >
        <h2 className="text-xl font-semibold">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
