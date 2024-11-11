import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; // Removed unused 'set' import
import { axiosInstance } from '../config/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
const navigate=useNavigate()
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(''); 

    try {
        const response = await axiosInstance.post("/user/login",
          { ...data },
          { withCredentials: true } // Add withCredentials option here
        );
        console.log(response);
        toast.success(response.data.message);
        if(response) {
            navigate('/');
          }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        setLoading(false);
        console.log(error.response?.data?.message || error.message);
      }
      
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: 'Email is required', 
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Display error message if any */}
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading} // Disable the button while loading
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/user/sign-up" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
