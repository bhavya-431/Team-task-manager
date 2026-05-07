export default function Input({ label, type = 'text', as, className = '', ...props }) {
  const Element = as === 'textarea' ? 'textarea' : 'input';
  return (
    <label className={`field-label ${className}`.trim()}>
      {label}
      <Element type={as === 'textarea' ? undefined : type} {...props} />
    </label>
  );
}
