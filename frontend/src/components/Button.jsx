export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button className={`${variant}-button ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
