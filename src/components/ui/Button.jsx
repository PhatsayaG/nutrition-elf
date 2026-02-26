import React from 'react';

export const Button = React.forwardRef(({ className, variant, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-emerald-500 text-white hover:bg-emerald-600 shadow",
    outline: "border border-emerald-500 bg-transparent text-emerald-600 hover:bg-emerald-50",
  };
  
  const variantStyle = variants[variant] || variants.default;

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantStyle} ${className}`}
      {...props}
    />
  );
});