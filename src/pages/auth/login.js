import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom'; 
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button'; 
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('login successful');
  
      const user = jwtDecode(res.data.token);
  
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'login failed');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">login</Button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          don't have an account?{' '}
          <span
            className="text-primary hover:underline cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
