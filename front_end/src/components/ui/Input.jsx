import React from 'react';

export default function Input({ 
  id, 
  name, 
  type = 'text', 
  label, 
  value, 
  onChange, 
  error, 
  required,
  className = ''
}) {
  return (
    <div className={`_social_registration_form_input _mar_b14 ${className}`}>
      <label className="_social_registration_label _mar_b8" htmlFor={id}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className={`form-control _social_registration_input ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}