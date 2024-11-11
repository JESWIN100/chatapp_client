import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/axiosInstance';
import { toast } from 'react-toastify';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../config/firbase';

export default function SignUpPage() {
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError
  } = useForm();

  const auth = getAuth(app);

  // Google Sign-in Handler
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const user = resultFromGoogle.user;
      console.log(user);

      // Prefill the form with Google user data
      setValue('fullName', user.displayName);
      setValue('email', user.email);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    if (data.password !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    try {
      const response = await axiosInstance.post('/user/create', data);
      console.log(response.data);
      if (response) {
        toast.success(response.data.message);
        navigate('/user/login');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-blue-50 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden max-w-4xl w-full">
        <div
          className="w-full md:w-1/2 bg-cover bg-center hidden md:block"
          style={{
            backgroundImage: `url('https://placehold.co/600x800')`,
          }}
        >
          <img
            alt="Illustration of a person working on a computer at a desk in a modern office setting"
            className="h-full w-full object-cover"
            src="https://snapdoc.vnress.in/assets/images/login-side-img.png"
          />
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Start Chat for free</h2>
          <p className="text-gray-600 mb-6">
            Create your 100% free account and start Chat with the best tool.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <input
                className="w-full p-3 border bg-white border-gray-300 rounded"
                placeholder="Full Name"
                required
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && <span className="text-red-500">{errors.fullName.message}</span>}
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <input
                className="w-full p-3 border bg-white border-gray-300 rounded"
                placeholder="Email"
                required
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
                })}
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
              <select
                className="w-full p-3 border bg-white border-gray-300 rounded"
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="" disabled selected>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="text-red-500">{errors.gender.message}</span>}
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <input
                className="w-full md:w-1/2 p-3 border bg-white border-gray-300 rounded"
                placeholder="Username"
                required
                type="text"
                {...register('userName', { required: 'Username is required' })}
              />
              {errors.userName && <span className="text-red-500">{errors.userName.message}</span>}
              <input
                className="w-full md:w-1/2 p-3 border bg-white border-gray-300 rounded"
                placeholder="Password"
                required
                type="password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>
            <div className="mb-4">
              <input
                className="w-full p-3 border bg-white border-gray-300 rounded"
                placeholder="Confirm Password"
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <span className="text-red-500">{errors.confirmPassword.message}</span>
              )}
            </div>
            <div className="flex items-center mb-6">
              <input
                className="mr-2 bg-white"
                id="terms"
                type="checkbox"
                required
              />
              <label className="text-gray-600" htmlFor="terms">
                I agree with the{" "}
                <a className="text-blue-500" href="#">
                  terms of use
                </a>
              </label>
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded" type="submit">
              Signup
            </button>
            <div className="text-center my-2">or</div>
            <button
              onClick={handleGoogleSignIn}
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded flex items-center justify-center"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                alt="Google logo"
                className="h-5 w-5 mr-2"
              />
              Sign in with Google
            </button>
          </form>
          <p className="text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to={'/user/login'} className="text-blue-500">Login</Link>
          </p>
          
        </div>
      </div>
    </div>
  );
}
