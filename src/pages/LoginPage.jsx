import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../config/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../config/firbase';
import Lottie from 'lottie-react';
import loginAnimation from '../assets/Animation - 1731340078522.json'; 

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const auth = getAuth(app);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    setLoading(true);

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const user = resultFromGoogle.user;
      setUser(user);
      await loginWithGoogle(user.email); // Trigger login after Google sign-in
    } catch (error) {
      setErrorMessage("Google sign-in failed");
      console.error(error);
      setLoading(false);
    }
  };

  const loginWithGoogle = async (email) => {
    try {
      const response = await axiosInstance.post("/user/Emaillogin", { email }, { withCredentials: true });
      toast.success(response.data.message);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setLoading(false);
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axiosInstance.post("/user/Namelogin", { userName: data.username }, { withCredentials: true });
      toast.success(response.data.message);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: `url('https://www.shutterstock.com/image-illustration/abstract-gradient-pink-purple-blue-600nw-1177024156.jpg')` }}
    >
      <div className="bg-opacity-70 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center text-slate-900 mb-6">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-slate-900">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Your Username Here"
              {...register('username', { required: 'Username is required' })}
              className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
          <div className="text-center my-2">or</div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full mt-4 bg-cyan-700 hover:bg-cyan-800 text-white p-3 rounded flex items-center justify-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
              alt="Google logo"
              className="h-5 w-5 mr-2"
            />
            {/* <Lottie animationData={loginAnimation} loop={true} className="mr-3 w-9 h-9" /> */}
            Login with Google
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-slate-900">
            Don't have an account?{' '}
            <a href="/user/sign-up" className="text-slate-200 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
