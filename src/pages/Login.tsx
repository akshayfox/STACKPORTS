import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Formik, Form } from 'formik';
import { CreditCard, QrCode, Scan, EyeIcon, EyeOffIcon } from 'lucide-react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const LoginValidationSchema = Yup.object().shape({
  username: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate(); 

  const handleSubmit = (values: { username: string; password: string }) => {
    login(values.username, values.password,navigate);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54 0h6v60h-6zM0 0h6v60H0zM48 0h6v60h-6zM6 0h6v60H6zM42 0h6v60h-6zM12 0h6v60h-6zM36 0h6v60h-6zM18 0h6v60H18zM30 0h6v60H30zM24 0h6v60H24z' fill='%23a5b4fc' fill-opacity='0.05'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="max-w-sm w-full relative shadow-2xl rounded-2xl border-none bg-white/90 backdrop-blur-sm p-6">
        <div className="text-center pb-4">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl transform rotate-6"></div>
            <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <CreditCard className="w-12 h-12 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <QrCode className="w-6 h-6 text-cyan-500 opacity-50" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Scan className="w-6 h-6 text-blue-500 opacity-50" />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            ID Designer
          </h1>
          <p className="text-gray-600 mt-2">
            Access your ID card design workspace
          </p>
        </div>
        
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={LoginValidationSchema}
          onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="space-y-6">
              <div>
                <input
                  name="username"
                  type="text"
                  placeholder="Email address"
                  value={values?.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-lg transition duration-300 ease-in-out ${
                    errors.username && touched.username
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.username && touched.username && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-lg transition duration-300 ease-in-out ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.password}
                  </p>
                )}
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition">
                Sign In
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;