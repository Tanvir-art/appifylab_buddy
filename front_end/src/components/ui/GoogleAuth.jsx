
import React from 'react';

export default function GoogleAuth({ text = 'Sign in with google' }) {
  const handleGoogleLogin = () => {
    // Google OAuth logic here
    console.log('Google login clicked');
  };

  return (
    <button 
      type="button" 
      className="_social_registration_content_btn _mar_b40"
      onClick={handleGoogleLogin}
    >
      <img src="/assets/images/google.svg" alt="Google" className="_google_img" />
      <span>{text}</span>
    </button>
  );
}