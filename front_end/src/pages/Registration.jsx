
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthBottomText from '../components/AuthBottom/AuthBottom';
import Shape from '../components/Shape/Shape';
import { authAPI } from '../services/api';

export default function Registration() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' || type === 'radio' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to terms & conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      
      const response = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeTerms: formData.agreeTerms
      });

      console.log('Registration Success:', response.data);

      
      setSuccessMessage('Registration successful! Please login to continue.');
      
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: true
      });

    } catch (error) {
      console.error('Registration failed:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Registration failed';
        
        if (status === 409) {
          setErrors(prev => ({ 
            ...prev, 
            email: 'This email is already registered. Please login.' 
          }));
          setServerError('Email already exists');
        } else if (status === 400) {
          const backendErrors = error.response.data?.errors;
          if (backendErrors && Array.isArray(backendErrors)) {
            const newErrors = {};
            backendErrors.forEach(err => {
              newErrors[err.field] = err.message;
            });
            setErrors(prev => ({ ...prev, ...newErrors }));
          } else {
            setServerError(message);
          }
        } else {
          setServerError(message || 'Something went wrong. Please try again.');
        }
      } else if (error.request) {
        setServerError('Cannot connect to server. Please check your internet connection.');
      } else {
        setServerError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <Shape />

      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/assets/images/registration.png" alt="Registration illustration" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src="/assets/images/registration1.png" alt="Registration illustration dark" />
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img src="/assets/images/logo.svg" alt="Buddy Script logo" className="_right_logo" />
                </div>

                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>

                
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}

                
                {serverError && (
                  <div className="alert alert-danger" role="alert">
                    {serverError}
                  </div>
                )}

                <button type="button" className="_social_registration_content_btn _mar_b40">
                  <img src="/assets/images/google.svg" alt="" className="_google_img" />
                  <span>Register with google</span>
                </button>

                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                <form onSubmit={handleSubmit} className="_social_registration_form" noValidate>
                  <div className="row">
                    {/* First Name */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="register-firstname">
                          Firstname <span className="text-danger">*</span>
                        </label>
                        <input
                          id="register-firstname"
                          name="firstName"
                          type="text"
                          className={`form-control _social_registration_input ${errors.firstName ? 'is-invalid' : ''}`}
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          disabled={isSubmitting}
                        />
                        {errors.firstName && (
                          <div className="invalid-feedback d-block">{errors.firstName}</div>
                        )}
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="register-lastname">
                          Lastname <span className="text-danger">*</span>
                        </label>
                        <input
                          id="register-lastname"
                          name="lastName"
                          type="text"
                          className={`form-control _social_registration_input ${errors.lastName ? 'is-invalid' : ''}`}
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          disabled={isSubmitting}
                        />
                        {errors.lastName && (
                          <div className="invalid-feedback d-block">{errors.lastName}</div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="register-email">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          id="register-email"
                          name="email"
                          type="email"
                          className={`form-control _social_registration_input ${errors.email ? 'is-invalid' : ''}`}
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <div className="invalid-feedback d-block">{errors.email}</div>
                        )}
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="register-password">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          id="register-password"
                          name="password"
                          type="password"
                          className={`form-control _social_registration_input ${errors.password ? 'is-invalid' : ''}`}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          disabled={isSubmitting}
                        />
                        {errors.password && (
                          <div className="invalid-feedback d-block">{errors.password}</div>
                        )}
                        <small className="text-muted">
                          Password must be at least 6 characters with uppercase, lowercase and number
                        </small>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="register-repeat-password">
                          Repeat Password <span className="text-danger">*</span>
                        </label>
                        <input
                          id="register-repeat-password"
                          name="confirmPassword"
                          type="password"
                          className={`form-control _social_registration_input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-enter your password"
                          disabled={isSubmitting}
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className={`form-check-input _social_registration_form_check_input ${
                            errors.agreeTerms ? 'is-invalid' : ''
                          }`}
                          type="checkbox"
                          name="agreeTerms"
                          id="registration-agree"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <label
                          className="form-check-label _social_registration_form_check_label"
                          htmlFor="registration-agree"
                        >
                          I agree to terms & conditions
                        </label>
                        {errors.agreeTerms && (
                          <div className="invalid-feedback d-block">{errors.agreeTerms}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_social_registration_form_btn_link _btn1"
                          disabled={isSubmitting}
                          style={{
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            width: '100%'
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Creating Account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <AuthBottomText
                  question="Already have an account?"
                  linkText="Login here"
                  linkTo="/login"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}