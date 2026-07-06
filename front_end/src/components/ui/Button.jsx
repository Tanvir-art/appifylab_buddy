import React from 'react';

export default function Button({ 
  children, 
  type = 'button', 
  onClick, 
  className = '', 
  fullWidth = false,
  disabled = false
}) {
  return (
    <button
      type={type}
      className={`_social_registration_form_btn_link ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      {children}
    </button>
  );
}