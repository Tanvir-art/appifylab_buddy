import { Link, useNavigate } from 'react-router-dom';
import AuthBottomText from '../components/AuthBottom/AuthBottom';
import Shape from '../components/Shape/Shape';
import { useState } from 'react';
import { authAPI } from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState(''); 
  const navigate = useNavigate();
  //  Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  //  Validate Form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
   const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      console.log('Login Response:', response.data);

     
      if (response.data.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      alert('Login successful! Welcome back!');
      navigate('/feed');
      
    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.response) {
        const message = error.response.data?.message || 'Login failed';
        if (error.response.status === 401) {
          setServerError('Invalid email or password. Please try again.');
        } else {
          setServerError(message);
        }
      } else if (error.request) {
        setServerError('Cannot connect to server. Please check your internet connection.');
      } else {
        setServerError('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
      <Shape />

      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_login_left">
                <div className="_social_login_left_image">
                  <img
                    src="/assets/images/login.png"
                    alt="Login illustration"
                    className="_left_img"
                  />
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_login_content">
                <div className="_social_login_left_logo _mar_b28">
                  <img
                    src="/assets/images/logo.svg"
                    alt="Buddy Script logo"
                    className="_left_logo"
                  />
                </div>

                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                <h4 className="_social_login_content_title _titl4 _mar_b50">
                  Login to your account
                </h4>

                <button type="button" className="_social_login_content_btn _mar_b40">
                  <img src="/assets/images/google.svg" alt="" className="_google_img" />
                  <span>Or sign-in with google</span>
                </button>

                <div className="_social_login_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                {/* Form with onSubmit */}
                <form onSubmit={handleSubmit} className="_social_login_form">
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label className="_social_login_label _mar_b8" htmlFor="login-email">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          id="login-email"
                          name="email"
                          type="email"
                          className={`form-control _social_login_input ${
                            errors.email ? 'is-invalid' : ''
                          }`}
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                        />
                        {errors.email && (
                          <div className="invalid-feedback d-block">
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label
                          className="_social_login_label _mar_b8"
                          htmlFor="login-password"
                        >
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          id="login-password"
                          name="password"
                          type="password"
                          className={`form-control _social_login_input ${
                            errors.password ? 'is-invalid' : ''
                          }`}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          required
                        />
                        {errors.password && (
                          <div className="invalid-feedback d-block">
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                      <div className="form-check _social_login_form_check">
                        <input
                          className="form-check-input _social_login_form_check_input"
                          type="radio"
                          name="loginRememberMe"
                          id="login-remember"
                          defaultChecked
                        />
                        <label
                          className="form-check-label _social_login_form_check_label"
                          htmlFor="login-remember"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                      <div className="_social_login_form_left">
                        <p className="_social_login_form_left_para">Forgot password?</p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_login_form_btn _mar_t40 _mar_b60">
                        {/*  Submit Button - type="submit" */}
                        <button
                          type="submit"
                          className="_social_login_form_btn_link _btn1"
                          disabled={isSubmitting}
                          style={{
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Logging in...
                            </>
                          ) : (
                            'Login now'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <AuthBottomText
                  question="Don't have an account?"
                  linkText="Create New Account"
                  linkTo="/registration"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}